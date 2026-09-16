import { computed, ref, shallowRef } from 'vue'
import type { FormErrors, FormRules, FormValues } from '../standard-schema'
import { ROOT, readPath, runRules } from '../utils/errors'
import { same, snapshot } from '../utils/values'

export type FormValidateOn = 'submit' | 'blur' | 'change'

interface Options {
  values: () => FormValues
  rules: () => FormRules | undefined
  validateOn: () => FormValidateOn
}

interface ServerError {
  message: string
  value: unknown
}

export function useForm(options: Options) {
  const found = shallowRef<FormErrors>({})
  const touched = ref(new Set<string>())
  const submitted = ref(false)
  const submitting = ref(false)
  const server = shallowRef(new Map<string, ServerError>())
  let pending: { values: FormValues; rules: FormRules | undefined } | undefined
  let validation = 0
  let submission = 0
  let initial = snapshot(options.values()) as FormValues

  function shown(key: string) {
    if (submitted.value || touched.value.has(key)) return true
    const mode = options.validateOn()
    return mode === 'change' && !same(readPath(options.values(), key), readPath(initial, key))
  }

  const errors = computed<FormErrors>(() => {
    const result: FormErrors = {}
    for (const [key, message] of Object.entries(found.value)) {
      if (key !== ROOT && shown(key)) result[key] = message
    }
    for (const [key, entry] of server.value) result[key] = entry.message
    return result
  })
  const formError = computed(() => found.value[ROOT])
  const invalid = computed(() => Object.keys(errors.value).length > 0 || !!formError.value)

  async function validate() {
    const version = ++validation
    const values = snapshot(options.values()) as FormValues
    const rules = options.rules()
    const request = { values, rules }
    pending = request
    try {
      const result = await runRules(rules, values)
      if (version !== validation || rules !== options.rules() || !same(values, options.values())) {
        return false
      }
      found.value = result
      return Object.keys(result).length === 0
    } finally {
      if (pending === request) pending = undefined
    }
  }

  function revalidate() {
    if (pending && pending.rules === options.rules() && same(pending.values, options.values()))
      return
    void validate()
  }

  function touch(name: string) {
    if (touched.value.has(name)) return
    touched.value = new Set(touched.value).add(name)
    if (options.validateOn() !== 'submit') revalidate()
  }

  function onChange() {
    const values = options.values()
    if (server.value.size) {
      const next = new Map(server.value)
      for (const [key, entry] of next) if (readPath(values, key) !== entry.value) next.delete(key)
      if (next.size !== server.value.size) server.value = next
    }
    if (submitted.value || options.validateOn() !== 'submit') revalidate()
  }

  async function submit(handler?: (values: FormValues) => unknown) {
    if (submitting.value) return false
    const version = ++submission
    const values = snapshot(options.values()) as FormValues
    submitted.value = true
    submitting.value = true
    try {
      const valid = await validate()
      if (
        !valid ||
        version !== submission ||
        server.value.size ||
        !same(values, options.values())
      ) {
        return false
      }
      await handler?.(options.values())
      return true
    } finally {
      if (version === submission) submitting.value = false
    }
  }

  function setErrors(next: FormErrors) {
    const values = options.values()
    const map = new Map<string, ServerError>()
    for (const [key, message] of Object.entries(next)) {
      map.set(key, { message, value: readPath(values, key) })
    }
    server.value = map
  }

  function reset() {
    validation++
    submission++
    pending = undefined
    submitting.value = false
    found.value = {}
    touched.value = new Set()
    submitted.value = false
    server.value = new Map()
    initial = snapshot(options.values()) as FormValues
  }

  return {
    errors,
    formError,
    invalid,
    submitted,
    submitting,
    validate,
    touch,
    onChange,
    submit,
    setErrors,
    reset,
  }
}
