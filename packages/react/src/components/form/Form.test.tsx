import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { createRef, useState } from 'react'
import { Form, type FormHandle, type FormProps } from './Form'
import { FormField } from '../form-field/FormField'
import { Input } from '../input/Input'
import type { FormErrors, FormRules, FormValidator, StandardSchema } from './standard-schema'

type Values = {
  name: string
  email: string
}

const schema: StandardSchema = {
  '~standard': {
    version: 1,
    vendor: 'test',
    validate(value) {
      const values = value as Values
      const issues = []
      if (!values.name) issues.push({ message: '请输入名称', path: ['name'] })
      if (values.email && !values.email.includes('@')) {
        issues.push({ message: '邮箱格式不正确', path: [{ key: 'email' }] })
      }
      if (values.name === 'root') issues.push({ message: '整体不通过' })
      return issues.length ? { issues } : { value }
    },
  },
}

const reactEnvironment = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }

beforeEach(() => {
  reactEnvironment.IS_REACT_ACT_ENVIRONMENT = false
})

afterEach(() => {
  cleanup()
  reactEnvironment.IS_REACT_ACT_ENVIRONMENT = true
})

function build(props: Partial<FormProps> = {}, rules: FormRules = schema) {
  const onSubmit = vi.fn()
  const handle = createRef<FormHandle>()
  const state: { values: Values; update: (patch: Partial<Values>) => void } = {
    values: { name: '', email: '' },
    update: () => {},
  }

  function Harness(extra: Partial<FormProps>) {
    const [values, setValues] = useState<Values>(state.values)
    state.values = values
    state.update = patch => setValues(current => ({ ...current, ...patch }))
    return (
      <Form ref={handle} values={values} rules={rules} onSubmit={onSubmit} {...props} {...extra}>
        {slot => (
          <>
            <p data-root="">{slot.error ?? ''}</p>
            <FormField name="name" label="名称">
              <Input
                value={values.name}
                onValueChange={next => state.update({ name: next ?? '' })}
              />
            </FormField>
            <FormField name="email" label="邮箱">
              <Input
                value={values.email}
                onValueChange={next => state.update({ email: next ?? '' })}
              />
            </FormField>
          </>
        )}
      </Form>
    )
  }

  const screen = render(<Harness />, {
    container: document.body.appendChild(document.createElement('div')),
  })
  const form = () => screen.container.querySelector('form')!
  const inputs = () => [...screen.container.querySelectorAll('input')]
  const messages = () =>
    [...screen.container.querySelectorAll('[data-hn-form-field] p[aria-live]')].map(
      p => p.textContent,
    )
  const set = async (patch: Partial<Values>) => {
    await act(async () => state.update(patch))
  }
  const settle = async () => {
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
  }
  return { screen, handle, state, onSubmit, form, inputs, messages, set, settle, Harness }
}

describe('Form', () => {
  it('异步校验等待期间禁用控件并阻止连续提交', async () => {
    let finish!: (errors: FormErrors) => void
    const rules = vi.fn(() => new Promise<FormErrors>(resolve => (finish = resolve)))
    const w = build({}, rules)
    let first!: Promise<void>
    let second!: Promise<void>
    await act(async () => {
      first = w.handle.current!.submit()
      second = w.handle.current!.submit()
    })
    expect(w.form().getAttribute('aria-busy')).toBe('true')
    expect(w.inputs().every(input => input.disabled)).toBe(true)
    expect(rules).toHaveBeenCalledTimes(1)
    finish({})
    await act(async () => {
      await Promise.all([first, second])
    })
    expect(w.onSubmit).toHaveBeenCalledTimes(1)
    expect(w.form().getAttribute('aria-busy')).toBeNull()
  })

  it('提交时校验，失败则显示错误、聚焦第一个无效控件并且不调用提交函数', async () => {
    const w = build()
    fireEvent.submit(w.form())
    await vi.waitFor(() => expect(w.messages()).toEqual(['请输入名称']))
    expect(w.inputs()[0]!.getAttribute('aria-invalid')).toBe('true')
    expect(w.inputs()[1]!.getAttribute('aria-invalid')).toBeNull()
    await vi.waitFor(() => expect(document.activeElement).toBe(w.inputs()[0]))
    expect(w.onSubmit).not.toHaveBeenCalled()
  })

  it('通过校验后调用提交函数，等待期间表单处于忙碌状态', async () => {
    let finish!: () => void
    const w = build()
    w.onSubmit.mockReturnValue(new Promise<void>(resolve => (finish = resolve)))
    await w.set({ name: '书音' })
    fireEvent.submit(w.form())
    await vi.waitFor(() => expect(w.onSubmit).toHaveBeenCalledWith(w.state.values))
    expect(w.form().getAttribute('aria-busy')).toBe('true')
    expect(w.screen.container.querySelector('input')!.disabled).toBe(true)
    finish()
    await vi.waitFor(() => expect(w.form().getAttribute('aria-busy')).toBeNull())
  })

  it('提交失败后，修改值即时重新校验', async () => {
    const w = build()
    fireEvent.submit(w.form())
    await vi.waitFor(() => expect(w.messages()).toEqual(['请输入名称']))
    await w.set({ name: '书音' })
    await vi.waitFor(() => expect(w.messages()).toEqual([]))
  })

  it('validateOn 为 blur 时，字段失去焦点后才校验', async () => {
    const w = build({ validateOn: 'blur' })
    await w.set({ email: 'x' })
    await w.settle()
    expect(w.messages()).toEqual([])
    fireEvent.focusOut(w.screen.container.querySelectorAll('[data-hn-form-field]')[1]!)
    await vi.waitFor(() => expect(w.messages()).toEqual(['邮箱格式不正确']))
  })

  it('validateOn 为 change 时随输入校验', async () => {
    const w = build({ validateOn: 'change' })
    await w.set({ email: 'x' })
    await vi.waitFor(() => expect(w.messages()).toEqual(['邮箱格式不正确']))
  })

  it('setErrors 显示外部错误，值改变后清除', async () => {
    const w = build()
    await w.set({ name: '书音', email: 'a@b.c' })
    await act(async () => w.handle.current!.setErrors({ email: '邮箱已被使用' }))
    expect(w.messages()).toEqual(['邮箱已被使用'])
    await w.set({ email: 'b@b.c' })
    await vi.waitFor(() => expect(w.messages()).toEqual([]))
  })

  it('接受普通校验函数', async () => {
    const rules: FormValidator = values => {
      const errors: FormErrors = {}
      if (!values.name) errors.name = '必填'
      return errors
    }
    const w = build({}, rules)
    fireEvent.submit(w.form())
    await vi.waitFor(() => expect(w.messages()).toEqual(['必填']))
  })

  it('没有路径的问题作为表单整体错误暴露给插槽', async () => {
    const w = build()
    await w.set({ name: 'root' })
    fireEvent.submit(w.form())
    await vi.waitFor(() =>
      expect(w.screen.container.querySelector('[data-root]')!.textContent).toBe('整体不通过'),
    )
    expect(w.messages()).toEqual([])
  })

  it('reset 清空错误与提交状态', async () => {
    const w = build()
    fireEvent.submit(w.form())
    await vi.waitFor(() => expect(w.messages()).toEqual(['请输入名称']))
    await act(async () => w.handle.current!.reset())
    await vi.waitFor(() => expect(w.messages()).toEqual([]))
    await w.set({ name: 'a' })
    await w.settle()
    expect(w.messages()).toEqual([])
  })

  it('disabled 使所有字段禁用', () => {
    const w = build({ disabled: true })
    expect(w.inputs().every(input => input.disabled)).toBe(true)
  })
})
