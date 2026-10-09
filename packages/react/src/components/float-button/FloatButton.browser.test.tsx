import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render, type RenderResult } from 'vitest-browser-react'
import { createRef, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import axe from 'axe-core'
import { TooltipProvider } from '../tooltip/TooltipProvider'
import { FloatButton } from './FloatButton'
import type { FloatButtonExpose, FloatButtonProps } from './types'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

const mounted: RenderResult[] = []
afterEach(async () => {
  for (const w of mounted.splice(0)) await w.unmount()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

type Options = Partial<Omit<FloatButtonProps, 'ref' | 'children'>>

async function setup(options: Options = {}, provider = true) {
  const props = signal<Options & { label: string }>({ label: 'Create project', ...options })
  const click = vi.fn()
  const submit = vi.fn((e: FormEvent) => e.preventDefault())
  const component = createRef<FloatButtonExpose>()
  const host = document.createElement('div')
  host.style.cssText = 'position:relative;width:320px;height:260px;margin:40px'
  document.body.append(host)
  function Control() {
    const current = props.use()
    return (
      <FloatButton {...current} ref={component} onClick={click}>
        <Plus />
      </FloatButton>
    )
  }
  const w = await render(
    <form onSubmit={submit}>
      {provider ? (
        <TooltipProvider delayDuration={0}>
          <Control />
        </TooltipProvider>
      ) : (
        <Control />
      )}
    </form>,
    { container: host },
  )
  mounted.push(w)
  return {
    w,
    host,
    props: {
      set: (next: Options) => {
        props.value = { ...props.value, ...next }
      },
    },
    click,
    submit,
    component,
    exists: () => !!host.querySelector('button'),
    button: () => host.querySelector('button') as HTMLButtonElement,
  }
}

it('uses a named native button, shows a tooltip, and does not submit by default', async () => {
  const s = await setup({ position: 'static' })
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
] as const)('keeps the %s icon button square', async (size, pixels) => {
  const s = await setup({ position: 'static', size })
  const box = s.button().getBoundingClientRect()
  expect(box.height).toBe(pixels)
  expect(box.width).toBe(pixels)
})

it('can show its label without a duplicate tooltip', async () => {
  const s = await setup({ position: 'static', extended: true })
  expect(s.button().textContent).toContain('Create project')
  const box = s.button().getBoundingClientRect()
  expect(box.width).toBeGreaterThan(box.height)
  await userEvent.hover(s.button())
  await new Promise(r => setTimeout(r, 100))
  expect(document.querySelector('[role=tooltip]')).toBeNull()
})

it('dismisses an open tooltip on hide and can show a fresh tooltip after returning', async () => {
  const s = await setup({ position: 'static' })
  await userEvent.hover(s.button())
  await vi.waitFor(() => expect(document.querySelector('[role=tooltip]')).not.toBeNull())
  s.props.set({ visible: false })
  await vi.waitFor(() => expect(document.querySelector('[role=tooltip]')).toBeNull())
  await vi.waitFor(() => expect(s.exists()).toBe(false))
  await userEvent.hover(s.host)
  s.props.set({ visible: true })
  await vi.waitFor(() => expect(s.exists()).toBe(true))
  await userEvent.hover(s.button())
  await vi.waitFor(() => expect(document.querySelector('[role=tooltip]')).not.toBeNull())
})

it('constrains a long extended label to its positioned container', async () => {
  const s = await setup({
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
  const s = await setup({ position: 'static' })
  const exiting = s.button()
  s.props.set({ visible: false })
  await new Promise(r => setTimeout(r))
  expect(exiting.inert).toBe(true)
  exiting.focus()
  expect(document.activeElement).not.toBe(exiting)
  s.props.set({ visible: true })
  await vi.waitFor(() => expect(s.button().inert).toBe(false))
  await userEvent.click(s.button())
  expect(s.click).toHaveBeenCalledOnce()
  expect(warn).not.toHaveBeenCalled()
})

it.each(['ltr', 'rtl'] as const)(
  'uses logical placement inside a positioned container in %s',
  async dir => {
    const s = await setup({ position: 'absolute', placement: 'bottom-end', offset: 16 })
    s.host.dir = dir
    const host = s.host.getBoundingClientRect(),
      button = s.button().getBoundingClientRect()
    expect(host.bottom - button.bottom).toBe(16)
    expect(dir === 'rtl' ? button.left - host.left : host.right - button.right).toBe(16)
  },
)

it('offsets each axis separately', async () => {
  const s = await setup({ position: 'absolute', placement: 'bottom-end', offset: { x: 12, y: 72 } })
  const host = s.host.getBoundingClientRect(),
    button = s.button().getBoundingClientRect()
  expect(host.bottom - button.bottom).toBe(72)
  expect(host.right - button.right).toBe(12)
})

it('keeps the default offset on the axis that is not given', async () => {
  const s = await setup({ position: 'absolute', placement: 'top-start', offset: { y: '4rem' } })
  const host = s.host.getBoundingClientRect(),
    button = s.button().getBoundingClientRect()
  expect(button.top - host.top).toBe(64)
  expect(button.left - host.left).toBe(24)
})

it('plays the whole exit when the press that hides it is still settling', async () => {
  const s = await setup({ position: 'static' })
  s.click.mockImplementation(() => s.props.set({ visible: false }))
  const button = s.button()
  let hidden = 0,
    removed = 0
  const observer = new MutationObserver(() => {
    if (!hidden && button.inert) hidden = performance.now()
    if (!removed && !button.isConnected) removed = performance.now()
  })
  observer.observe(s.host, { attributes: true, childList: true, subtree: true })
  await userEvent.click(button, { delay: 60 })
  await vi.waitFor(() => expect(removed).toBeGreaterThan(0))
  observer.disconnect()
  expect(removed - hidden).toBeGreaterThan(150)
})

it('fixes to the viewport and allows placement changes', async () => {
  const s = await setup({ offset: 20 })
  expect(getComputedStyle(s.button()).position).toBe('fixed')
  expect(innerHeight - s.button().getBoundingClientRect().bottom).toBe(20)
  s.props.set({ placement: 'top-start' })
  await vi.waitFor(() => expect(s.button().getBoundingClientRect().top).toBe(20))
  expect(s.button().getBoundingClientRect().left).toBe(20)
})

it.each(['disabled', 'loading'] as const)('blocks activation while %s', async state => {
  const s = await setup({ position: 'static', [state]: true } as Options)
  s.button().click()
  expect(s.button().disabled).toBe(true)
  expect(s.click).not.toHaveBeenCalled()
})

it.each([false, true])(
  'animates visibility without invalid roots or leaked tooltip attributes, provider=%s',
  async provider => {
    const warn = vi.spyOn(console, 'warn')
    const s = await setup({ position: 'static', visible: false }, provider)
    expect(s.exists()).toBe(false)
    s.props.set({ visible: true })
    await vi.waitFor(() => expect(s.exists()).toBe(true))
    expect(s.button().hasAttribute('content')).toBe(false)
    s.component.current!.focus()
    expect(document.activeElement).toBe(s.button())
    s.props.set({ visible: false })
    await vi.waitFor(() => expect(s.exists()).toBe(false))
    expect(warn).not.toHaveBeenCalled()
  },
)
