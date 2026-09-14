import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, reactive, ref, type Component, type VNodeChild } from 'vue'
import { expectNoA11yViolations } from '../../test/axe'
import Sheet from '../components/sheet/Sheet.vue'
import Drawer from '../components/drawer/Drawer.vue'
import '../../test/browser.css'

type Slots = Partial<{
  icon: () => VNodeChild
  title: () => VNodeChild
  body: (props: { close: () => void }) => VNodeChild
}>
let wrapper: VueWrapper | undefined
beforeEach(async () => {
  await page.viewport(1000, 800)
  document.body.innerHTML = ''
})
afterEach(async () => {
  wrapper?.unmount()
  wrapper = undefined
  await vi.waitFor(() => expect(document.body.style.overflow).toBe(''))
})

const components: Record<string, Component> = { Sheet, Drawer }
const panel = () => document.querySelector<HTMLElement>('[role="dialog"]')!
function render(
  kind: string,
  initialProps: Record<string, unknown> = {},
  initialSlots: Slots = {},
) {
  const props = reactive<Record<string, unknown>>({ handle: false, ...initialProps })
  const slots = reactive(initialSlots)
  const open = ref(false)
  wrapper = mount(
    {
      setup: () => () =>
        h(
          components[kind]!,
          {
            title: 'Panel title',
            description: 'Panel description',
            ...props,
            open: open.value,
            'onUpdate:open': (value: boolean) => {
              open.value = value
            },
          },
          {
            default: () => h('button', 'Open panel'),
            content: ({ close }: { close: () => void }) =>
              h('div', { 'data-content': '', style: 'height:180px' }, [
                h('button', { onClick: close }, 'Content close'),
              ]),
            footer: ({ close }: { close: () => void }) =>
              h('button', { 'data-footer': '', onClick: close }, 'Footer close'),
            ...slots,
          },
        ),
    },
    { attachTo: document.body },
  )
  async function show() {
    await userEvent.click(wrapper!.get('button').element)
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
    const demo = render(
      kind,
      { description: undefined },
      {
        icon: () => h('svg', { 'data-icon': '', viewBox: '0 0 24 24' }),
        title: () => h('span', 'Custom title'),
      },
    )
    await demo.show()
    expect(label('aria-labelledby').tagName).toBe('H2')
    expect(label('aria-labelledby').textContent).toBe('Custom title')
    expect(panel().querySelector('[data-icon]')!.closest('[aria-hidden="true"]')).toBeTruthy()
    expect(panel().hasAttribute('aria-describedby')).toBe(false)
    await expectNoA11yViolations(panel())
    delete demo.slots.title
    await nextTick()
    expect(label('aria-labelledby').textContent).toBe('Panel title')
  })

  it('hides the header without replacing the content and restores it dynamically', async () => {
    const demo = render(
      kind,
      { header: true },
      {
        icon: () => h('span', { 'data-icon': '' }, 'Icon'),
        title: () => h('span', 'Custom title'),
      },
    )
    await demo.show()
    const root = panel()
    const content = root.querySelector('[data-content]')
    demo.props.header = false
    await nextTick()
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
    demo.props.header = true
    await nextTick()
    expect(label('aria-labelledby').textContent).toBe('Custom title')
    expect(root.querySelector('[aria-label="关闭"]')).toBeTruthy()
  })

  it.each([false, true])(
    'closable=false only hides the button, with locked=%s controlling dismissal',
    async locked => {
      const demo = render(kind, { closable: false, locked })
      await demo.show()
      expect(panel().querySelector('[aria-label="关闭"]')).toBeNull()
      await userEvent.keyboard('{Escape}')
      if (!locked) {
        await vi.waitFor(() => expect(panel()).toBeNull())
        await demo.show()
      }
      await outside()
      if (locked) {
        expect(demo.open.value).toBe(true)
        await userEvent.click(panel().querySelector('[data-footer]')!)
      }
      await vi.waitFor(() => expect(panel()).toBeNull())
      expect(demo.open.value).toBe(false)
    },
  )

  it.each([false, true])(
    'body replaces all default regions, preserves accessibility and supports close while locked=%s',
    async locked => {
      const demo = render(
        kind,
        { locked },
        {
          icon: () => h('span', 'Unused icon'),
          title: () => h('span', 'Unused title'),
          body: ({ close }) =>
            h('div', { 'data-body': '', style: 'min-height:180px' }, [
              h('button', { onClick: close }, 'Body close'),
            ]),
        },
      )
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
      expect([
        style.paddingTop,
        style.paddingBottom,
        style.paddingLeft,
        style.paddingRight,
      ]).toEqual(['0px', '0px', '0px', '0px'])
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
      await vi.waitFor(() => expect(panel()).toBeNull())
      expect(document.activeElement).toBe(wrapper!.get('button').element)
    },
  )

  it('an empty body still replaces the layout and adding or removing it retains the panel', async () => {
    const demo = render(kind, {}, { body: () => [] })
    await demo.show()
    const root = panel()
    expect(root.querySelector('[data-content]')).toBeNull()
    expect(root.querySelector('[data-footer]')).toBeNull()
    delete demo.slots.body
    await nextTick()
    expect(panel()).toBe(root)
    expect(root.querySelector('[data-content]')).toBeTruthy()
    expect(getComputedStyle(label('aria-labelledby')).position).not.toBe('absolute')
    demo.slots.body = () => h('p', 'New body')
    await nextTick()
    expect(panel()).toBe(root)
    expect(root.querySelector('[data-content]')).toBeNull()
    expect(root.textContent).toContain('New body')
    expect(getComputedStyle(label('aria-labelledby')).position).toBe('absolute')
  })
})

it.each([false, true])(
  'Sheet body preserves handle dragging with locked=%s without making the body draggable',
  async locked => {
    const demo = render(
      'Sheet',
      { handle: true, locked },
      {
        body: ({ close }) =>
          h(
            'div',
            { 'data-body': '', style: 'height:240px' },
            h('button', { onClick: close }, 'Body close'),
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
      await nextTick()
      window.dispatchEvent(pointer('pointerup', 300))
      await nextTick()
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
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(demo.open.value).toBe(false)
  },
)

it('Sheet body can remove the handle without leaving a drag region or changing its content', async () => {
  const demo = render(
    'Sheet',
    { handle: true },
    { body: () => h('div', { 'data-body': '', style: 'height:200px' }) },
  )
  await demo.show()
  const root = panel()
  const body = root.querySelector('[data-body]')
  demo.props.handle = false
  await nextTick()
  expect(root.querySelector('[data-hn-sheet-grip]')).toBeNull()
  expect(root.querySelector('[data-body]')).toBe(body)
  expect(getComputedStyle(root).paddingTop).toBe('0px')
})
