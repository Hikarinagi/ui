import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import { createRef, useState } from 'react'
import { Stepper } from './Stepper'
import type {
  StepperExpose,
  StepperItem,
  StepperNavigation,
  StepperProps,
  StepperSlotProps,
} from './types'
import { expectNoA11yViolations } from '../../../test/axe'
import { UiLocaleProvider, enUS } from '../../locale'

afterEach(cleanup)
const items: StepperItem[] = [
  { title: 'First' },
  { title: 'Second', description: 'Second description' },
  { title: 'Third' },
]
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
function emitted(fn: ReturnType<typeof vi.fn>) {
  return fn.mock.calls.length ? fn.mock.calls : undefined
}
function call<T>(fn: () => Promise<T>) {
  return act(fn)
}
function mountStepper<T extends StepperItem = StepperItem>(initial: Partial<StepperProps<T>>) {
  const vm = createRef<StepperExpose>()
  const valueChange = vi.fn()
  const error = vi.fn()
  let props = initial
  const ui = () => (
    <Stepper<T> items={[] as T[]} {...props} ref={vm} onValueChange={valueChange} onError={error} />
  )
  const result = render(ui())
  const element = result.container.firstElementChild as HTMLElement
  return {
    vm: () => vm.current!,
    element,
    unmount: result.unmount,
    events: { 'update:modelValue': valueChange, error },
    findAll: (selector: string) => Array.from(element.querySelectorAll(selector)),
    find: (selector: string) => element.querySelector(selector),
    setProps: async (next: Partial<StepperProps<T>>) => {
      props = { ...props, ...next }
      await act(async () => result.rerender(ui()))
    },
  }
}
function renderStepper(props: Partial<StepperProps> = {}) {
  return mountStepper({ items, ...props })
}

describe('Stepper', () => {
  it('starts on the first step, supports sequential navigation and keeps the input unchanged', async () => {
    const wrapper = renderStepper()
    const buttons = wrapper.findAll('button')
    expect(buttons[0]!.getAttribute('aria-current')).toBe('step')
    expect(buttons[1]!.getAttribute('disabled') ?? undefined).toBeUndefined()
    expect(buttons[2]!.getAttribute('disabled')).toBe('')
    expect(await call(() => wrapper.vm().goTo(3))).toBe(false)
    expect(await call(() => wrapper.vm().next())).toBe(true)
    expect(emitted(wrapper.events['update:modelValue'])).toEqual([[2]])
    expect(wrapper.findAll('button')[1]!.getAttribute('aria-current')).toBe('step')
    expect(await call(() => wrapper.vm().prev())).toBe(true)
    expect(items[0]!.completed).toBeUndefined()
  })

  it('uses defaultValue and lets non-linear navigation reach any enabled step', async () => {
    const wrapper = renderStepper({ defaultValue: 2, linear: false })
    expect(wrapper.vm().step).toBe(2)
    expect(await call(() => wrapper.vm().goTo(1))).toBe(true)
    expect(await call(() => wrapper.vm().goTo(3))).toBe(true)
    expect(await call(() => wrapper.vm().next())).toBe(false)
    expect(await call(() => wrapper.vm().goTo(0))).toBe(false)
    expect(await call(() => wrapper.vm().goTo(1.5))).toBe(false)
    expect(await call(() => wrapper.vm().goTo(NaN))).toBe(false)
  })

  it('applies disabled state to every navigation entry, including exposed methods', async () => {
    const wrapper = renderStepper({
      items: [{ title: 'First' }, { title: 'Disabled', disabled: true }, { title: 'Last' }],
      linear: false,
    })
    expect(wrapper.vm().canNext).toBe(false)
    expect(await call(() => wrapper.vm().next())).toBe(false)
    expect(await call(() => wrapper.vm().goTo(2))).toBe(false)
    expect(await call(() => wrapper.vm().goTo(3))).toBe(true)
    await wrapper.setProps({ disabled: true })
    expect(await call(() => wrapper.vm().prev())).toBe(false)
    expect(await call(() => wrapper.vm().goTo(1))).toBe(false)
    expect(wrapper.findAll('button').every(button => button.getAttribute('disabled') === '')).toBe(
      true,
    )
  })

  it('blocks duplicate navigation while a guard is pending and preserves the step on rejection', async () => {
    const guard = deferred<boolean>()
    const beforeChange = vi.fn(() => guard.promise)
    const wrapper = renderStepper({ beforeChange })
    let attempt!: Promise<boolean>
    act(() => {
      attempt = wrapper.vm().next()
    })
    expect(wrapper.vm().pending).toBe(true)
    expect(await call(() => wrapper.vm().next())).toBe(false)
    expect(await call(() => wrapper.vm().goTo(2))).toBe(false)
    expect(beforeChange).toHaveBeenCalledTimes(1)
    guard.resolve(false)
    expect(await call(() => attempt)).toBe(false)
    expect(wrapper.vm().step).toBe(1)
    expect(wrapper.vm().pending).toBe(false)
    expect(emitted(wrapper.events['update:modelValue'])).toBeUndefined()
  })

  it('catches failed async guards and emits error without an unhandled rejection', async () => {
    const error = new Error('Validation failed')
    const wrapper = renderStepper({ beforeChange: () => Promise.reject(error) })
    expect(await call(() => wrapper.vm().next())).toBe(false)
    expect(wrapper.vm().pending).toBe(false)
    expect(wrapper.vm().step).toBe(1)
    expect(emitted(wrapper.events.error)).toEqual([[error]])
  })

  it('ignores stale validation after an external model update', async () => {
    const guard = deferred<boolean>()
    const wrapper = renderStepper({ value: 1, beforeChange: () => guard.promise })
    let attempt!: Promise<boolean>
    act(() => {
      attempt = wrapper.vm().next()
    })
    await wrapper.setProps({ value: 3 })
    guard.resolve(true)
    expect(await call(() => attempt)).toBe(false)
    expect(wrapper.vm().step).toBe(3)
    expect(emitted(wrapper.events['update:modelValue'])).toBeUndefined()
  })

  it('invalidates pending navigation when items change or a target becomes disabled', async () => {
    const guard = deferred<boolean>()
    const wrapper = renderStepper({ beforeChange: () => guard.promise })
    let attempt!: Promise<boolean>
    act(() => {
      attempt = wrapper.vm().next()
    })
    await wrapper.setProps({ items: [{ title: 'First' }, { title: 'Second', disabled: true }] })
    guard.resolve(true)
    expect(await call(() => attempt)).toBe(false)
    expect(wrapper.vm().step).toBe(1)
    expect(wrapper.vm().pending).toBe(false)
  })

  it('does not emit a stale error after unmount', async () => {
    const guard = deferred<boolean>()
    const wrapper = renderStepper({ beforeChange: () => guard.promise })
    const vm = wrapper.vm()
    let attempt!: Promise<boolean>
    act(() => {
      attempt = vm.next()
    })
    wrapper.unmount()
    guard.reject(new Error('Late failure'))
    expect(await attempt).toBe(false)
    expect(emitted(wrapper.events.error)).toBeUndefined()
  })

  it('allows validation to update completion or error state before advancing', async () => {
    let navigation!: StepperNavigation
    function App() {
      const [data, setData] = useState(items.map(item => ({ ...item, error: false })))
      return (
        <Stepper
          items={data}
          beforeChange={async () => {
            setData(current =>
              current.map((item, index) =>
                index === 0 ? { ...item, completed: true, error: false } : item,
              ),
            )
            return true
          }}
        >
          {scope => {
            navigation = scope
            return <p>{String(scope.step)}</p>
          }}
        </Stepper>
      )
    }
    const { container } = render(<App />)
    expect(await call(() => navigation.next())).toBe(true)
    expect(container.querySelector('p')!.textContent).toBe('2')
  })

  it('provides typed custom fields and retains current semantics for an errored or completed active item', async () => {
    const data: Array<StepperItem & { details: string }> = [
      { title: 'First', error: true, details: 'Custom' },
    ]
    type Item = (typeof data)[number]
    const wrapper = mountStepper<Item>({
      items: data,
      renderIndicator: ({ item }: StepperSlotProps<Item>) => <span>{item.details}</span>,
      renderTitle: ({ item }: StepperSlotProps<Item>) => <span>{item.title}</span>,
      children: ({ item, step }: StepperNavigation<Item>) => <p>{`${step}:${item?.details}`}</p>,
    })
    expect(wrapper.find('p')!.textContent).toBe('1:Custom')
    expect(wrapper.find('button')!.getAttribute('aria-current')).toBe('step')
    const describedBy = wrapper.find('button')!.getAttribute('aria-describedby')!
    expect(document.getElementById(describedBy)?.textContent).toContain('该步骤存在错误')
    await expectNoA11yViolations(wrapper.element)
    await wrapper.setProps({ items: [{ ...data[0]!, error: false, completed: true }] })
    expect(wrapper.find('button')!.getAttribute('aria-current')).toBe('step')
  })

  it('has valid accessible names without optional descriptions and localizes progress', async () => {
    const { container } = render(
      <UiLocaleProvider messages={enUS}>
        <Stepper items={items} />
      </UiLocaleProvider>,
    )
    const element = container.firstElementChild as HTMLElement
    expect(element.querySelector('[role=group]')!.getAttribute('aria-label')).toBe('Steps')
    expect(Array.from(element.querySelectorAll('[role=status]')).at(-1)!.textContent!.trim()).toBe(
      'Step 1 of 3',
    )
    const buttons = Array.from(element.querySelectorAll('button'))
    expect(buttons[0]!.getAttribute('aria-describedby') ?? undefined).toBeUndefined()
    expect(
      document.getElementById(buttons[1]!.getAttribute('aria-describedby')!)?.textContent,
    ).toBe('Second description')
    await expectNoA11yViolations(element)
  })

  it('handles empty and shrinking item sets without invalid navigation', async () => {
    const wrapper = renderStepper({ items: [], defaultValue: 9 })
    expect(wrapper.vm().step).toBe(0)
    expect(wrapper.find('button') !== null).toBe(false)
    expect(await call(() => wrapper.vm().next())).toBe(false)
    await wrapper.setProps({ items })
    expect(wrapper.vm().step).toBe(3)
    await wrapper.setProps({ items: items.slice(0, 1) })
    expect(wrapper.vm().step).toBe(1)
  })

  it('allows a guard to clear an error supplied through newly computed items', async () => {
    const guard = deferred<boolean>()
    const wrapper = renderStepper({
      items: items.map(item => ({ ...item, error: true })),
      beforeChange: () => guard.promise,
    })
    let attempt!: Promise<boolean>
    act(() => {
      attempt = wrapper.vm().next()
    })
    await wrapper.setProps({ items: items.map(item => ({ ...item, error: false })) })
    guard.resolve(true)
    expect(await call(() => attempt)).toBe(true)
    expect(wrapper.vm().step).toBe(2)
  })
})
