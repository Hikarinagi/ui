import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, shallowReactive } from 'vue'
import { TooltipProvider } from 'reka-ui'
import { Plus } from '@lucide/vue'
import axe from 'axe-core'
import FloatButton from './FloatButton.vue'
import type { FloatButtonProps } from './types'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})
function setup(options: Partial<FloatButtonProps> = {}, provider = true) {
  const props = shallowReactive({ label: 'Create project', ...options })
  const click = vi.fn()
  const submit = vi.fn((e: Event) => e.preventDefault())
  const host = document.createElement('div')
  host.style.cssText = 'position:relative;width:320px;height:260px;margin:40px'
  document.body.append(host)
  const control = () => h(FloatButton, { ...props, onClick: click }, { default: () => h(Plus) })
  const w = mount(
    {
      render: () =>
        h('form', { onSubmit: submit }, [
          provider ? h(TooltipProvider, { delayDuration: 0 }, { default: control }) : control(),
        ]),
    },
    { attachTo: host, global: { stubs: { transition: false } } },
  )
  mounted.push(w)
  return {
    w,
    host,
    props,
    click,
    submit,
    component: w.getComponent(FloatButton),
    button: () => w.get('button').element as HTMLButtonElement,
  }
}

it('uses a named native button, shows a tooltip, and does not submit by default', async () => {
  const s = setup({ position: 'static' })
  expect(s.button().getAttribute('aria-label')).toBe('Create project')
  expect(s.button().hasAttribute('title')).toBe(false)
  await userEvent.hover(s.button())
  await vi.waitFor(() => expect(document.querySelector('[role=tooltip]')).not.toBeNull())
  await userEvent.click(s.button())
  expect(s.click).toHaveBeenCalledOnce()
  expect(s.submit).not.toHaveBeenCalled()
  expect((await axe.run(s.host, { rules: { region: { enabled: false } } })).violations).toEqual([])
})

it.each([
  ['sm', 40],
  ['md', 48],
  ['lg', 56],
] as const)('keeps the %s icon button square', (size, pixels) => {
  const s = setup({ position: 'static', size })
  const box = s.button().getBoundingClientRect()
  expect(box.height).toBe(pixels)
  expect(box.width).toBe(pixels)
})

it('can show its label without a duplicate tooltip', async () => {
  const s = setup({ position: 'static', extended: true })
  expect(s.button().textContent).toContain('Create project')
  const box = s.button().getBoundingClientRect()
  expect(box.width).toBeGreaterThan(box.height)
  await userEvent.hover(s.button())
  await new Promise(r => setTimeout(r, 100))
  expect(document.querySelector('[role=tooltip]')).toBeNull()
})

it('dismisses an open tooltip on hide and can show a fresh tooltip after returning', async () => {
  const s = setup({ position: 'static' })
  await userEvent.hover(s.button())
  await vi.waitFor(() => expect(document.querySelector('[role=tooltip]')).not.toBeNull())
  s.props.visible = false
  await vi.waitFor(() => expect(document.querySelector('[role=tooltip]')).toBeNull())
  await vi.waitFor(() => expect(s.w.find('button').exists()).toBe(false))
  await userEvent.hover(s.host)
  s.props.visible = true
  await vi.waitFor(() => expect(s.w.find('button').exists()).toBe(true))
  await userEvent.hover(s.button())
  await vi.waitFor(() => expect(document.querySelector('[role=tooltip]')).not.toBeNull())
})

it('constrains a long extended label to its positioned container', () => {
  const s = setup({
    position: 'absolute',
    offset: 16,
    extended: true,
    label: 'Create a new project with a very long descriptive name',
  })
  const bounds = s.button().getBoundingClientRect(),
    host = s.host.getBoundingClientRect()
  expect(bounds.left).toBeGreaterThanOrEqual(host.left + 16)
  expect(bounds.right).toBeLessThanOrEqual(host.right - 16)
  const text = s.button().querySelector<HTMLElement>('.truncate')!
  expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)
})

it('makes the exiting button inert and restores interaction on re-entry', async () => {
  const warn = vi.spyOn(console, 'warn')
  const s = setup({ position: 'static' })
  const exiting = s.button()
  s.props.visible = false
  await nextTick()
  expect(exiting.inert).toBe(true)
  exiting.focus()
  expect(document.activeElement).not.toBe(exiting)
  s.props.visible = true
  await vi.waitFor(() => expect(s.button().inert).toBe(false))
  await userEvent.click(s.button())
  expect(s.click).toHaveBeenCalledOnce()
  expect(warn).not.toHaveBeenCalled()
})

it.each(['ltr', 'rtl'] as const)(
  'uses logical placement inside a positioned container in %s',
  dir => {
    const s = setup({ position: 'absolute', placement: 'bottom-end', offset: 16 })
    s.host.dir = dir
    const host = s.host.getBoundingClientRect(),
      button = s.button().getBoundingClientRect()
    expect(host.bottom - button.bottom).toBe(16)
    expect(dir === 'rtl' ? button.left - host.left : host.right - button.right).toBe(16)
  },
)

it('fixes to the viewport and allows placement changes', async () => {
  const s = setup({ offset: 20 })
  expect(getComputedStyle(s.button()).position).toBe('fixed')
  expect(innerHeight - s.button().getBoundingClientRect().bottom).toBe(20)
  s.props.placement = 'top-start'
  await vi.waitFor(() => expect(s.button().getBoundingClientRect().top).toBe(20))
  expect(s.button().getBoundingClientRect().left).toBe(20)
})

it.each(['disabled', 'loading'] as const)('blocks activation while %s', state => {
  const s = setup({ position: 'static', [state]: true })
  s.button().click()
  expect(s.button().disabled).toBe(true)
  expect(s.click).not.toHaveBeenCalled()
})

it.each([false, true])(
  'animates visibility without invalid roots or leaked tooltip attributes, provider=%s',
  async provider => {
    const warn = vi.spyOn(console, 'warn')
    const s = setup({ position: 'static', visible: false }, provider)
    expect(s.w.find('button').exists()).toBe(false)
    s.props.visible = true
    await vi.waitFor(() => expect(s.w.find('button').exists()).toBe(true))
    expect(s.button().hasAttribute('content')).toBe(false)
    s.component.vm.focus()
    expect(document.activeElement).toBe(s.button())
    s.props.visible = false
    await vi.waitFor(() => expect(s.w.find('button').exists()).toBe(false))
    expect(warn).not.toHaveBeenCalled()
  },
)
