import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import type { ComponentType, ReactNode } from 'react'
import { expectNoA11yViolations } from '../../test/axe'
import { Sheet } from '../components/sheet/Sheet'
import { Drawer } from '../components/drawer/Drawer'
import { mount } from '../../test/mount'
import { signal, tick } from '../../test/signal'
import '../../test/browser.css'

interface SlotProps {
  close: () => void
}

type Slots = Partial<{
  icon: ReactNode
  titleContent: ReactNode
  renderBody: (props: SlotProps) => ReactNode
}>

interface PanelProps extends Slots {
  title: string
  description?: string
  header?: boolean
  closable?: boolean
  locked?: boolean
  handle?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  renderContent?: (props: SlotProps) => ReactNode
  renderFooter?: (props: SlotProps) => ReactNode
  children?: ReactNode
}

let wrapper: { unmount: () => Promise<void>; container: HTMLElement } | undefined
beforeEach(async () => {
  await page.viewport(1000, 800)
  document.body.innerHTML = ''
})
afterEach(async () => {
  await wrapper?.unmount()
  wrapper = undefined
  await vi.waitFor(() => expect(document.body.style.overflow).toBe(''))
})

const components: Record<string, ComponentType<PanelProps>> = { Sheet, Drawer }
const panel = () => document.querySelector<HTMLElement>('[role="dialog"]')!
const trigger = () => wrapper!.container.querySelector('button')!

async function render(
  kind: string,
  initialProps: Partial<PanelProps> = {},
  initialSlots: Slots = {},
) {
  const props = signal<Partial<PanelProps>>({ handle: false, ...initialProps })
  const slots = signal<Slots>(initialSlots)
  const open = signal(false)
  const Panel = components[kind]!
  function Harness() {
    const current = props.use()
    const currentSlots = slots.use()
    return (
      <Panel
        title="Panel title"
        description="Panel description"
        {...current}
        open={open.use()}
        onOpenChange={value => {
          open.value = value
        }}
        renderContent={({ close }) => (
          <div data-content="" style={{ height: '180px' }}>
            <button onClick={close}>Content close</button>
          </div>
        )}
        renderFooter={({ close }) => (
          <button data-footer="" onClick={close}>
            Footer close
          </button>
        )}
        {...currentSlots}
      >
        <button>Open panel</button>
      </Panel>
    )
  }
  wrapper = await mount(<Harness />)
  async function show() {
    await userEvent.click(trigger())
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    await Promise.allSettled(
      panel()
        .getAnimations()
        .map(animation => animation.finished),
    )
  }
  return { props, slots, open, show }
}
function label(attribute: string) {
  return document.getElementById(panel().getAttribute(attribute)!)!
}
async function outside() {
  await userEvent.click(document.querySelector('.hn-scrim')!, { position: { x: 20, y: 20 } })
}

describe.each(Object.keys(components))('%s panel slots', kind => {
  it('renders a decorative icon and custom heading, then restores the title prop when the slot is removed', async () => {
    const demo = await render(
      kind,
      { description: undefined },
      {
        icon: <svg data-icon="" viewBox="0 0 24 24" />,
        titleContent: <span>Custom title</span>,
      },
    )
    await demo.show()
    expect(label('aria-labelledby').tagName).toBe('H2')
    expect(label('aria-labelledby').textContent).toBe('Custom title')
    expect(panel().querySelector('[data-icon]')!.closest('[aria-hidden="true"]')).toBeTruthy()
    expect(panel().hasAttribute('aria-describedby')).toBe(false)
    await expectNoA11yViolations(panel())
    const { titleContent: _, ...rest } = demo.slots.value
    demo.slots.value = rest
    await tick()
    expect(label('aria-labelledby').textContent).toBe('Panel title')
  })

  it('hides the header without replacing the content and restores it dynamically', async () => {
    const demo = await render(
      kind,
      { header: true },
      {
        icon: <span data-icon="">Icon</span>,
        titleContent: <span>Custom title</span>,
      },
    )
    await expectHeaderToggle(demo, 'Custom title')
  })

  it.each([false, true])(
    'closable=false only hides the button, with locked=%s controlling dismissal',
    async locked => {
      const demo = await render(kind, { closable: false, locked })
      await demo.show()
      expect(panel().querySelector('[aria-label="关闭"]')).toBeNull()
      await userEvent.keyboard('{Escape}')
      if (!locked) {
        await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
        await demo.show()
      }
      await outside()
      if (locked) {
        expect(demo.open.value).toBe(true)
        await userEvent.click(panel().querySelector('[data-footer]')!)
      }
      await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
      expect(demo.open.value).toBe(false)
    },
  )

  it.each([false, true])(
    'body replaces all default regions, preserves accessibility and supports close while locked=%s',
    async locked => {
      const demo = await render(
        kind,
        { locked },
        {
          icon: <span>Unused icon</span>,
          titleContent: <span>Unused title</span>,
          renderBody: ({ close }) => <BodyClose close={close} />,
        },
      )
      await expectBodyMode(demo, locked)
    },
  )
})

function BodyClose({ close }: { close: () => void }) {
  return (
    <div data-body="" style={{ minHeight: '180px' }}>
      <button onClick={close}>Body close</button>
    </div>
  )
}

async function expectHeaderToggle(demo: Awaited<ReturnType<typeof render>>, restoredTitle: string) {
  await demo.show()
  const root = panel()
  const content = root.querySelector('[data-content]')
  demo.props.value = { ...demo.props.value, header: false }
  await tick()
  expect(panel()).toBe(root)
  expect(root.querySelector('[data-content]')).toBe(content)
  expect(root.querySelector('[data-footer]')).toBeTruthy()
  expect(root.querySelector('[aria-label="关闭"]')).toBeNull()
  expect(root.querySelector('[data-icon]')).toBeNull()
  expect(root.textContent).not.toContain('Custom title')
  expect(getComputedStyle(label('aria-labelledby')).position).toBe('absolute')
  expect(label('aria-labelledby').textContent).toBe('Panel title')
  expect(getComputedStyle(label('aria-describedby')).position).toBe('absolute')
  await expectNoA11yViolations(root)
  demo.props.value = { ...demo.props.value, header: true }
  await tick()
  expect(label('aria-labelledby').textContent).toBe(restoredTitle)
  expect(root.querySelector('[aria-label="关闭"]')).toBeTruthy()
}

async function expectBodyMode(demo: Awaited<ReturnType<typeof render>>, locked: boolean) {
  await demo.show()
  const root = panel()
  expect(root.querySelector('[data-content]')).toBeNull()
  expect(root.querySelector('[data-footer]')).toBeNull()
  expect(root.querySelector('[data-overlayscrollbars]')).toBeNull()
  expect(root.querySelector('[aria-label="关闭"]')).toBeNull()
  expect(root.textContent).not.toContain('Unused')
  expect(label('aria-labelledby').textContent).toBe('Panel title')
  expect(getComputedStyle(label('aria-labelledby')).position).toBe('absolute')
  expect(label('aria-describedby').textContent).toBe('Panel description')
  const style = getComputedStyle(root)
  expect([style.paddingTop, style.paddingBottom, style.paddingLeft, style.paddingRight]).toEqual([
    '0px',
    '0px',
    '0px',
    '0px',
  ])
  expect(parseFloat(style.rowGap) || 0).toBe(0)
  const body = root.querySelector('[data-body]')!
  expect(body.getBoundingClientRect().top - root.getBoundingClientRect().top).toBeCloseTo(
    root.clientTop,
    0,
  )
  expect(body.getBoundingClientRect().left - root.getBoundingClientRect().left).toBeCloseTo(
    root.clientLeft,
    0,
  )
  expect(root.contains(document.activeElement)).toBe(true)
  expect(document.body.style.overflow).toBe('hidden')
  await expectNoA11yViolations(root)
  if (locked) {
    await userEvent.keyboard('{Escape}')
    await outside()
    expect(demo.open.value).toBe(true)
  }
  await userEvent.click(body.querySelector('button')!)
  await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
  expect(document.activeElement).toBe(trigger())
}

it.each([false, true])(
  'Sheet body preserves handle dragging with locked=%s without making the body draggable',
  async locked => {
    const demo = await render(
      'Sheet',
      { handle: true, locked },
      {
        renderBody: ({ close }) => (
          <div data-body="" style={{ height: '240px' }}>
            <button onClick={close}>Body close</button>
          </div>
        ),
      },
    )
    await demo.show()
    const root = panel()
    const body = root.querySelector('[data-body]')!
    const grip = root.querySelector('[data-hn-sheet-grip]')!
    const pointer = (type: string, y: number) =>
      new PointerEvent(type, {
        bubbles: true,
        pointerId: 7,
        pointerType: 'touch',
        button: 0,
        clientY: y,
      })
    async function drag(target: Element) {
      target.dispatchEvent(pointer('pointerdown', 100))
      window.dispatchEvent(pointer('pointermove', 300))
      await tick()
      window.dispatchEvent(pointer('pointerup', 300))
      await tick()
    }
    await drag(body)
    expect(root.style.transform).toBe('')
    expect(demo.open.value).toBe(true)
    expect(body.getBoundingClientRect().top).toBeCloseTo(grip.getBoundingClientRect().bottom, 0)
    await drag(grip)
    if (locked) {
      expect(root.style.transform).toBe('')
      expect(demo.open.value).toBe(true)
      await userEvent.click(body.querySelector('button')!)
    }
    await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
    expect(demo.open.value).toBe(false)
  },
)

it('Sheet body can remove the handle without leaving a drag region or changing its content', async () => {
  const demo = await render(
    'Sheet',
    { handle: true },
    { renderBody: () => <div data-body="" style={{ height: '200px' }} /> },
  )
  await demo.show()
  const root = panel()
  const body = root.querySelector('[data-body]')
  demo.props.value = { ...demo.props.value, handle: false }
  await tick()
  expect(root.querySelector('[data-hn-sheet-grip]')).toBeNull()
  expect(root.querySelector('[data-body]')).toBe(body)
  expect(getComputedStyle(root).paddingTop).toBe('0px')
})
