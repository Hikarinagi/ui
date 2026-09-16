import { describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import type { FormErrors } from '../standard-schema'
import { useForm } from './useForm'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

function setup() {
  const values = reactive({ name: 'old' })
  const pending: ReturnType<typeof deferred<FormErrors>>[] = []
  const rules = vi.fn(() => {
    const task = deferred<FormErrors>()
    pending.push(task)
    return task.promise
  })
  const form = useForm({ values: () => values, rules: () => rules, validateOn: () => 'submit' })
  form.touch('name')
  return { form, values, rules, pending }
}

describe('useForm async validation', () => {
  it('keeps the latest result when an older validation finishes last', async () => {
    const { form, values, pending } = setup()
    const old = form.validate()
    values.name = 'new'
    const latest = form.validate()
    pending[1]!.resolve({})
    expect(await latest).toBe(true)
    pending[0]!.resolve({ name: 'old error' })
    expect(await old).toBe(false)
    expect(form.errors.value).toEqual({})
  })

  it('does not clear a newer error with an older success', async () => {
    const { form, pending } = setup()
    const old = form.validate()
    const latest = form.validate()
    pending[1]!.resolve({ name: 'new error' })
    await latest
    pending[0]!.resolve({})
    await old
    expect(form.errors.value).toEqual({ name: 'new error' })
  })

  it('validates a snapshot and rejects a result for changed values', async () => {
    const { form, values, rules, pending } = setup()
    const handler = vi.fn()
    const task = form.submit(handler)
    values.name = 'new'
    expect(rules.mock.calls[0]).toEqual([{ name: 'old' }])
    pending[0]!.resolve({})
    expect(await task).toBe(false)
    expect(handler).not.toHaveBeenCalled()
    expect(form.submitting.value).toBe(false)
  })

  it('covers validation and submission with one busy period', async () => {
    const { form, pending, rules } = setup()
    const saving = deferred<void>()
    const handler = vi.fn(() => saving.promise)
    const task = form.submit(handler)
    expect(form.submitting.value).toBe(true)
    expect(await form.submit(handler)).toBe(false)
    expect(rules).toHaveBeenCalledTimes(1)
    pending[0]!.resolve({})
    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1))
    expect(form.submitting.value).toBe(true)
    expect(await form.submit(handler)).toBe(false)
    saving.resolve()
    expect(await task).toBe(true)
    expect(form.submitting.value).toBe(false)
  })

  it('reset invalidates field and root errors from pending validation', async () => {
    const { form, pending } = setup()
    const task = form.validate()
    form.reset()
    pending[0]!.resolve({ name: 'old field error', '': 'old root error' })
    expect(await task).toBe(false)
    form.touch('name')
    expect(form.errors.value).toEqual({})
    expect(form.formError.value).toBeUndefined()
  })

  it('reset cancels a pending submission without releasing a newer busy period', async () => {
    const { form, pending } = setup()
    const handler = vi.fn()
    const old = form.submit(handler)
    form.reset()
    const latest = form.submit(handler)
    pending[0]!.resolve({})
    expect(await old).toBe(false)
    expect(handler).not.toHaveBeenCalled()
    expect(form.submitting.value).toBe(true)
    pending[1]!.resolve({})
    expect(await latest).toBe(true)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(form.submitting.value).toBe(false)
  })

  it('releases the busy state after validation rejects', async () => {
    const { form, pending } = setup()
    const handler = vi.fn()
    const task = form.submit(handler)
    pending[0]!.reject(new Error('validation failed'))
    await expect(task).rejects.toThrow('validation failed')
    expect(handler).not.toHaveBeenCalled()
    expect(form.submitting.value).toBe(false)
  })
})
