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
    found.value = await runRules(options.rules(), options.values())
    return Object.keys(found.value).length === 0
  }

  function touch(name: string) {
    if (touched.value.has(name)) return
    touched.value = new Set(touched.value).add(name)
    if (options.validateOn() !== 'submit') void validate()
  }

  function onChange() {
    const values = options.values()
    if (server.value.size) {
      const next = new Map(server.value)
      for (const [key, entry] of next) if (readPath(values, key) !== entry.value) next.delete(key)
      if (next.size !== server.value.size) server.value = next
    }
    if (submitted.value || options.validateOn() !== 'submit') void validate()
  }

  async function submit(handler?: (values: FormValues) => unknown) {
    submitted.value = true
    const valid = await validate()
    if (!valid || server.value.size) return false
    submitting.value = true
    try {
      await handler?.(options.values())
    } finally {
      submitting.value = false
    }
    return true
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
