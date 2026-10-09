import type { FormErrors, FormRules, FormValues } from '../lib/form/standard-schema'
import { ROOT, readPath, runRules } from '../lib/form/errors'
import { same, snapshot } from '../lib/form/values'

export type FormValidateOn = 'submit' | 'blur' | 'change'

export interface FormOptions {
  values: () => FormValues
  rules: () => FormRules | undefined
  validateOn: () => FormValidateOn
}

interface ServerError {
  message: string
  value: unknown
}

export interface FormController {
  errors: () => FormErrors
  formError: () => string | undefined
  invalid: () => boolean
  submitted: () => boolean
  submitting: () => boolean
  version: () => number
  subscribe: (listener: () => void) => () => void
  validate: () => Promise<boolean>
  touch: (name: string) => void
  onChange: () => void
  submit: (handler?: (values: FormValues) => unknown) => Promise<boolean>
  setErrors: (errors: FormErrors) => void
  reset: () => void
}

export function createForm(options: FormOptions): FormController {
  let found: FormErrors = {}
  let touched = new Set<string>()
  let submitted = false
  let submitting = false
  let server = new Map<string, ServerError>()
  let pending: { values: FormValues } | undefined
  let validation = 0
  let submission = 0
  let initial = snapshot(options.values()) as FormValues
  let version = 0
  const listeners = new Set<() => void>()

  function notify() {
    version++
    for (const listener of [...listeners]) listener()
  }

  function shown(key: string) {
    if (submitted || touched.has(key)) return true
    const mode = options.validateOn()
    return mode === 'change' && !same(readPath(options.values(), key), readPath(initial, key))
  }

  function errors() {
    const result: FormErrors = {}
    for (const [key, message] of Object.entries(found)) {
      if (key !== ROOT && shown(key)) result[key] = message
    }
    for (const [key, entry] of server) result[key] = entry.message
    return result
  }

  function formError() {
    return found[ROOT]
  }

  function invalid() {
    return Object.keys(errors()).length > 0 || !!formError()
  }

  async function validate() {
    const current = ++validation
    const values = snapshot(options.values()) as FormValues
    const request = { values }
    pending = request
    try {
      const result = await runRules(options.rules(), values)
      if (current !== validation || !same(values, options.values())) return false
      found = result
      notify()
      return Object.keys(result).length === 0
    } finally {
      if (pending === request) pending = undefined
    }
  }

  function revalidate() {
    if (pending && same(pending.values, options.values())) return
    void validate()
  }

  function touch(name: string) {
    if (touched.has(name)) return
    touched = new Set(touched).add(name)
    notify()
    if (options.validateOn() !== 'submit') revalidate()
  }

  function onChange() {
    const values = options.values()
    if (server.size) {
      const next = new Map(server)
      for (const [key, entry] of next) if (readPath(values, key) !== entry.value) next.delete(key)
      if (next.size !== server.size) {
        server = next
        notify()
      }
    }
    if (submitted || options.validateOn() !== 'submit') revalidate()
  }

  async function submit(handler?: (values: FormValues) => unknown) {
    if (submitting) return false
    const current = ++submission
    const values = snapshot(options.values()) as FormValues
    submitted = true
    submitting = true
    notify()
    try {
      const valid = await validate()
      if (!valid || current !== submission || server.size || !same(values, options.values())) {
        return false
      }
      await handler?.(options.values())
      return true
    } finally {
      if (current === submission) {
        submitting = false
        notify()
      }
    }
  }

  function setErrors(next: FormErrors) {
    const values = options.values()
    const map = new Map<string, ServerError>()
    for (const [key, message] of Object.entries(next)) {
      map.set(key, { message, value: readPath(values, key) })
    }
    server = map
    notify()
  }

  function reset() {
    validation++
    submission++
    pending = undefined
    submitting = false
    found = {}
    touched = new Set()
    submitted = false
    server = new Map()
    initial = snapshot(options.values()) as FormValues
    notify()
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  return {
    errors,
    formError,
    invalid,
    submitted: () => submitted,
    submitting: () => submitting,
    version: () => version,
    subscribe,
    validate,
    touch,
    onChange,
    submit,
    setErrors,
    reset,
  }
}
