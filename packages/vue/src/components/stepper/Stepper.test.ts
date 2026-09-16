import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import Stepper from './Stepper.vue'
import type { StepperItem, StepperNavigation, StepperSlotProps } from './types'
import { expectNoA11yViolations } from '../../../test/axe'
import { provideUiLocale, enUS } from '../../locale'

const mounted: VueWrapper[] = []
afterEach(() => mounted.splice(0).forEach(wrapper => wrapper.unmount()))
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
function render(props: Record<string, unknown> = {}) {
  const wrapper = mount(Stepper, { attachTo: document.body, props: { items, ...props } })
  mounted.push(wrapper)
  return wrapper
}

describe('Stepper', () => {
  it('starts on the first step, supports sequential navigation and keeps the input unchanged', async () => {
    const wrapper = render()
    const buttons = wrapper.findAll('button')
    expect(buttons[0]!.attributes('aria-current')).toBe('step')
    expect(buttons[1]!.attributes('disabled')).toBeUndefined()
    expect(buttons[2]!.attributes('disabled')).toBe('')
    expect(await wrapper.vm.goTo(3)).toBe(false)
    expect(await wrapper.vm.next()).toBe(true)
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
    expect(wrapper.findAll('button')[1]!.attributes('aria-current')).toBe('step')
    expect(await wrapper.vm.prev()).toBe(true)
    expect(items[0]!.completed).toBeUndefined()
  })

  it('uses defaultValue and lets non-linear navigation reach any enabled step', async () => {
    const wrapper = render({ defaultValue: 2, linear: false })
    expect(wrapper.vm.step).toBe(2)
    expect(await wrapper.vm.goTo(1)).toBe(true)
    expect(await wrapper.vm.goTo(3)).toBe(true)
    expect(await wrapper.vm.next()).toBe(false)
    expect(await wrapper.vm.goTo(0)).toBe(false)
    expect(await wrapper.vm.goTo(1.5)).toBe(false)
    expect(await wrapper.vm.goTo(NaN)).toBe(false)
  })

  it('applies disabled state to every navigation entry, including exposed methods', async () => {
    const wrapper = render({
      items: [{ title: 'First' }, { title: 'Disabled', disabled: true }, { title: 'Last' }],
      linear: false,
    })
    expect(wrapper.vm.canNext).toBe(false)
    expect(await wrapper.vm.next()).toBe(false)
    expect(await wrapper.vm.goTo(2)).toBe(false)
    expect(await wrapper.vm.goTo(3)).toBe(true)
    await wrapper.setProps({ disabled: true })
    expect(await wrapper.vm.prev()).toBe(false)
    expect(await wrapper.vm.goTo(1)).toBe(false)
    expect(wrapper.findAll('button').every(button => button.attributes('disabled') === '')).toBe(
      true,
    )
  })

  it('blocks duplicate navigation while a guard is pending and preserves the step on rejection', async () => {
    const guard = deferred<boolean>()
    const beforeChange = vi.fn(() => guard.promise)
    const wrapper = render({ beforeChange })
    const attempt = wrapper.vm.next()
    expect(wrapper.vm.pending).toBe(true)
    expect(await wrapper.vm.next()).toBe(false)
    expect(await wrapper.vm.goTo(2)).toBe(false)
    expect(beforeChange).toHaveBeenCalledTimes(1)
    guard.resolve(false)
    expect(await attempt).toBe(false)
    expect(wrapper.vm.step).toBe(1)
    expect(wrapper.vm.pending).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('catches failed async guards and emits error without an unhandled rejection', async () => {
    const error = new Error('Validation failed')
    const wrapper = render({ beforeChange: () => Promise.reject(error) })
    expect(await wrapper.vm.next()).toBe(false)
    expect(wrapper.vm.pending).toBe(false)
    expect(wrapper.vm.step).toBe(1)
    expect(wrapper.emitted('error')).toEqual([[error]])
  })

  it('ignores stale validation after an external model update', async () => {
    const guard = deferred<boolean>()
    const wrapper = render({ modelValue: 1, beforeChange: () => guard.promise })
    const attempt = wrapper.vm.next()
    await wrapper.setProps({ modelValue: 3 })
    guard.resolve(true)
    expect(await attempt).toBe(false)
    expect(wrapper.vm.step).toBe(3)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('invalidates pending navigation when items change or a target becomes disabled', async () => {
    const guard = deferred<boolean>()
    const wrapper = render({ beforeChange: () => guard.promise })
    const attempt = wrapper.vm.next()
    await wrapper.setProps({ items: [{ title: 'First' }, { title: 'Second', disabled: true }] })
    guard.resolve(true)
    expect(await attempt).toBe(false)
    expect(wrapper.vm.step).toBe(1)
    expect(wrapper.vm.pending).toBe(false)
  })

  it('does not emit a stale error after unmount', async () => {
    const guard = deferred<boolean>()
    const wrapper = render({ beforeChange: () => guard.promise })
    const attempt = wrapper.vm.next()
    wrapper.unmount()
    mounted.pop()
    guard.reject(new Error('Late failure'))
    expect(await attempt).toBe(false)
    expect(wrapper.emitted('error')).toBeUndefined()
  })

  it('allows validation to update completion or error state before advancing', async () => {
    const data = ref(items.map(item => ({ ...item, error: false })))
    let navigation!: StepperNavigation
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(
            Stepper,
            {
              items: data.value,
              beforeChange: async () => {
                data.value[0]!.completed = true
                data.value[0]!.error = false
                return true
              },
            },
            {
              default: (scope: StepperNavigation) => {
                navigation = scope
                return h('p', String(scope.step))
              },
            },
          ),
      }),
    )
    mounted.push(wrapper)
    expect(await navigation.next()).toBe(true)
    await flushPromises()
    expect(wrapper.find('p').text()).toBe('2')
  })

  it('provides typed custom fields and retains current semantics for an errored or completed active item', async () => {
    const data: Array<StepperItem & { details: string }> = [
      { title: 'First', error: true, details: 'Custom' },
    ]
    type Item = (typeof data)[number]
    const wrapper = mount(Stepper<Item>, {
      attachTo: document.body,
      props: { items: data },
      slots: {
        indicator: ({ item }: StepperSlotProps<Item>) => h('span', item.details),
        title: ({ item }: StepperSlotProps<Item>) => h('span', item.title),
        default: ({ item, step }: StepperNavigation<Item>) => h('p', `${step}:${item?.details}`),
      },
    })
    mounted.push(wrapper)
    expect(wrapper.find('p').text()).toBe('1:Custom')
    expect(wrapper.find('button').attributes('aria-current')).toBe('step')
    const describedBy = wrapper.find('button').attributes('aria-describedby')!
    expect(document.getElementById(describedBy)?.textContent).toContain('该步骤存在错误')
    await expectNoA11yViolations(wrapper.element)
    await wrapper.setProps({ items: [{ ...data[0]!, error: false, completed: true }] })
    expect(wrapper.find('button').attributes('aria-current')).toBe('step')
  })

  it('has valid accessible names without optional descriptions and localizes progress', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          provideUiLocale(enUS)
          return () => h(Stepper, { items })
        },
      }),
      { attachTo: document.body },
    )
    mounted.push(wrapper)
    expect(wrapper.find('[role=group]').attributes('aria-label')).toBe('Steps')
    expect(wrapper.findAll('[role=status]').at(-1)!.text()).toBe('Step 1 of 3')
    const buttons = wrapper.findAll('button')
    expect(buttons[0]!.attributes('aria-describedby')).toBeUndefined()
    expect(document.getElementById(buttons[1]!.attributes('aria-describedby')!)?.textContent).toBe(
      'Second description',
    )
    await expectNoA11yViolations(wrapper.element)
  })

  it('handles empty and shrinking item sets without invalid navigation', async () => {
    const wrapper = render({ items: [], defaultValue: 9 })
    expect(wrapper.vm.step).toBe(0)
    expect(wrapper.find('button').exists()).toBe(false)
    expect(await wrapper.vm.next()).toBe(false)
    await wrapper.setProps({ items })
    expect(wrapper.vm.step).toBe(3)
    await wrapper.setProps({ items: items.slice(0, 1) })
    expect(wrapper.vm.step).toBe(1)
  })

  it('allows a guard to clear an error supplied through newly computed items', async () => {
    const guard = deferred<boolean>()
    const wrapper = render({
      items: items.map(item => ({ ...item, error: true })),
      beforeChange: () => guard.promise,
    })
    const attempt = wrapper.vm.next()
    await wrapper.setProps({ items: items.map(item => ({ ...item, error: false })) })
    guard.resolve(true)
    expect(await attempt).toBe(true)
    expect(wrapper.vm.step).toBe(2)
  })
})
