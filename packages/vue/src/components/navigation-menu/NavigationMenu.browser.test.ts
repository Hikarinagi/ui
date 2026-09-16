import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import axe from 'axe-core'
import { BookOpen, ArrowUpRight } from '@lucide/vue'
import NavigationMenu from './NavigationMenu.vue'
import NavigationMenuItem from './NavigationMenuItem.vue'
import NavigationMenuTrigger from './NavigationMenuTrigger.vue'
import NavigationMenuContent from './NavigationMenuContent.vue'
import NavigationMenuLink from './NavigationMenuLink.vue'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

function setup(props: Record<string, unknown> = {}, inheritedDirection = 'ltr') {
  const value = ref('')
  const host = document.createElement('div')
  host.dir = inheritedDirection
  host.style.cssText = 'padding: 40px; min-height: 440px;'
  document.body.appendChild(host)
  const wrapper = mount(
    defineComponent({
      render: () =>
        h(
          NavigationMenu,
          {
            label: 'Navigation',
            trigger: 'click',
            ...props,
            modelValue: value.value,
            'onUpdate:modelValue': (next: string) => (value.value = next),
          },
          () => [
            ...['one', 'two'].map((name, index) =>
              h(NavigationMenuItem, { value: name }, () => [
                h(
                  NavigationMenuTrigger,
                  {},
                  {
                    default: () => name,
                    icon: () => h(BookOpen),
                  },
                ),
                h(NavigationMenuContent, { class: index ? 'w-96' : 'w-72' }, () => [
                  h(
                    NavigationMenuLink,
                    { href: `#${name}-first`, onClick: (event: Event) => event.preventDefault() },
                    {
                      default: () => `${name} first`,
                      icon: () => h(BookOpen),
                      trailing: () => h(ArrowUpRight),
                    },
                  ),
                  h(
                    NavigationMenuLink,
                    { href: `#${name}-last`, description: 'Description' },
                    () => `${name} last`,
                  ),
                ]),
              ]),
            ),
            h(NavigationMenuItem, {}, () =>
              h(NavigationMenuTrigger, { disabled: true }, () => 'disabled'),
            ),
            h(NavigationMenuItem, {}, () =>
              h(NavigationMenuLink, { href: '#disabled', disabled: true }, () => 'disabled link'),
            ),
            h(NavigationMenuItem, {}, () =>
              h(NavigationMenuLink, { href: '#about' }, () => 'about'),
            ),
          ],
        ),
    }),
    { attachTo: host },
  )
  wrappers.push(wrapper)
  const root = wrapper.element as HTMLElement
  return {
    value,
    root,
    wrapper,
    controls: () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          '[data-hn-navigation-list] > li > [data-hn-navigation-control]',
        ),
      ),
    viewport: () => root.querySelector<HTMLElement>('[data-hn-navigation-viewport]')!,
    content: () =>
      root.querySelector<HTMLElement>('[data-hn-navigation-content][data-state=open]')!,
  }
}

describe('NavigationMenu browser', () => {
  it.each([
    ['horizontal', 'ltr', 'bottom'],
    ['vertical', 'ltr', 'right'],
    ['vertical', 'rtl', 'left'],
  ] as const)(
    'uses the shared pop motion for %s %s entry and exit',
    async (orientation, dir, side) => {
      const menu = setup({ orientation, dir }, dir)
      menu.value.value = 'one'
      await vi.waitFor(() => expect(menu.viewport()?.dataset.side).toBe(side))
      await vi.waitFor(() =>
        expect(getComputedStyle(menu.viewport()).animationName).toBe('hn-pop-in'),
      )
      const viewport = menu.viewport()
      const enter = viewport
        .getAnimations()
        .find(animation => (animation as CSSAnimation).animationName === 'hn-pop-in')!
      enter.pause()
      enter.currentTime = 0
      const style = getComputedStyle(viewport)
      const start = new DOMMatrix(style.transform)
      const travel = parseFloat(style.getPropertyValue('--hn-travel-sm'))
      expect(start.m11).toBeCloseTo(0.96)
      expect(start.m22).toBeCloseTo(0.96)
      expect(start.m41).toBe(side === 'bottom' ? 0 : side === 'right' ? -travel : travel)
      expect(start.m42).toBe(side === 'bottom' ? -travel : 0)
      expect(enter.effect!.getTiming().duration).toBe(
        parseFloat(style.getPropertyValue('--hn-duration-base')),
      )
      enter.finish()
      await vi.waitFor(() => expect(getComputedStyle(viewport).transform).toBe('none'))
      menu.value.value = ''
      await vi.waitFor(() => expect(getComputedStyle(viewport).animationName).toBe('hn-pop-out'))
      const exit = viewport
        .getAnimations()
        .find(animation => (animation as CSSAnimation).animationName === 'hn-pop-out')!
      exit.pause()
      exit.currentTime = 0
      expect(new DOMMatrix(getComputedStyle(viewport).transform).m11).toBe(1)
      expect(exit.effect!.getTiming().duration).toBe(
        parseFloat(style.getPropertyValue('--hn-duration-exit')),
      )
      expect(getComputedStyle(viewport).pointerEvents).toBe('none')
      exit.currentTime = Number(exit.effect!.getTiming().duration) - 1
      expect(new DOMMatrix(getComputedStyle(viewport).transform).m11).toBeCloseTo(0.96, 2)
      exit.finish()
      await vi.waitFor(() => expect(menu.viewport()).toBeNull())
    },
  )

  it.each([
    ['horizontal', 'ltr'],
    ['horizontal', 'rtl'],
    ['vertical', 'ltr'],
    ['vertical', 'rtl'],
  ] as const)(
    'opens and reopens %s %s panels without drifting from an unmeasured position',
    async (orientation, dir) => {
      const menu = setup({ orientation, dir, unmountOnHide: false }, dir)
      for (const value of ['two', 'one']) {
        const frames: { x: number; y: number; width: number; height: number }[] = []
        const start = performance.now()
        const sampled = new Promise<void>(resolve => {
          function sample() {
            const viewport = menu.viewport()
            if (
              viewport &&
              !viewport.hidden &&
              getComputedStyle(viewport).visibility === 'visible'
            ) {
              frames.push({
                x: viewport.offsetLeft,
                y: viewport.offsetTop,
                width: viewport.offsetWidth,
                height: viewport.offsetHeight,
              })
            }
            if (performance.now() - start < 450) requestAnimationFrame(sample)
            else resolve()
          }
          requestAnimationFrame(sample)
        })
        menu.value.value = value
        await sampled
        expect(frames.length).toBeGreaterThan(5)
        expect(
          Math.max(...frames.map(frame => frame.x)) - Math.min(...frames.map(frame => frame.x)),
        ).toBeLessThan(1)
        expect(
          Math.max(...frames.map(frame => frame.y)) - Math.min(...frames.map(frame => frame.y)),
        ).toBeLessThan(1)
        expect(frames.every(frame => frame.width > 100 && frame.height > 30)).toBe(true)
        menu.value.value = ''
        await vi.waitFor(() => expect(menu.viewport().hidden).toBe(true))
      }
    },
  )

  it.each([
    ['sm', 14],
    ['md', 16],
    ['lg', 18],
  ] as const)(
    'sizes all %s icons consistently and rotates the disclosure with the open state',
    async (size, pixels) => {
      const menu = setup({ size })
      const trigger = menu.controls()[0]!
      const disclosure = trigger.querySelector('.hn-transition')!
      expect(getComputedStyle(disclosure).rotate).toBe('none')
      await userEvent.click(trigger)
      await vi.waitFor(() => expect(getComputedStyle(disclosure).rotate).toBe('180deg'))
      await vi.waitFor(() => expect(getComputedStyle(menu.viewport()).transform).toBe('none'))
      const icons = [...trigger.querySelectorAll('svg'), ...menu.content().querySelectorAll('svg')]
      expect(icons).toHaveLength(4)
      for (const icon of icons) {
        expect(icon.getBoundingClientRect().width).toBe(pixels)
        expect(icon.getBoundingClientRect().height).toBe(pixels)
      }
      await userEvent.click(trigger)
      await vi.waitFor(() => expect(getComputedStyle(disclosure).rotate).toBe('none'))
    },
  )

  it.each(['ltr', 'rtl'])(
    'keeps outgoing and incoming %s content on a stable physical origin while resizing',
    async dir => {
      const menu = setup({ dir }, dir)
      await userEvent.click(menu.controls()[0]!)
      await vi.waitFor(() => expect(menu.viewport()?.clientWidth).toBe(288))
      await userEvent.click(menu.controls()[1]!)
      await vi.waitFor(() =>
        expect(menu.content()?.dataset.motion).toBe(dir === 'rtl' ? 'from-start' : 'from-end'),
      )
      const content = menu.content()
      const animation = content
        .getAnimations()
        .find(animation => (animation as CSSAnimation).animationName === 'hn-navigation-in')!
      expect(animation).toBeDefined()
      animation.pause()
      animation.currentTime = 0
      const transform = new DOMMatrix(getComputedStyle(content).transform)
      expect(Math.sign(transform.m41)).toBe(dir === 'rtl' ? -1 : 1)
      expect(transform.m42).toBe(0)
      for (let index = 0; index < 8; index++) {
        await new Promise(requestAnimationFrame)
        expect(content.offsetLeft).toBe(0)
        expect(content.offsetTop).toBe(0)
      }
      animation.finish()
      await vi.waitFor(() =>
        expect(menu.viewport()?.clientWidth).toBe(Math.min(384, window.innerWidth - 34)),
      )
    },
  )

  it('opens measured panels, animates their sizes and preserves the trigger position', async () => {
    const menu = setup()
    const first = menu.controls()[0]!
    const before = first.getBoundingClientRect()
    await userEvent.click(first)
    await vi.waitFor(() => {
      expect(menu.viewport().clientWidth).toBe(288)
      expect(menu.viewport().clientHeight).toBeGreaterThan(60)
    })
    expect(menu.viewport().getBoundingClientRect().top).toBeGreaterThanOrEqual(before.bottom)
    await userEvent.click(menu.controls()[1]!)
    await vi.waitFor(() =>
      expect(menu.viewport().clientWidth).toBe(Math.min(384, window.innerWidth - 34)),
    )
    expect(first.getBoundingClientRect().y).toBe(before.y)
    expect(getComputedStyle(menu.viewport()).transitionProperty).toContain('width')
  })

  it.each(['ltr', 'rtl'])(
    'inherits %s and navigates in visual order, skipping disabled items',
    async dir => {
      const menu = setup({}, dir)
      const controls = menu.controls()
      await vi.waitFor(() => expect(getComputedStyle(menu.root).direction).toBe(dir))
      controls[0]!.focus()
      await userEvent.keyboard(dir === 'rtl' ? '{ArrowLeft}' : '{ArrowRight}')
      expect(document.activeElement).toBe(controls[1])
      await userEvent.keyboard(dir === 'rtl' ? '{ArrowLeft}' : '{ArrowRight}')
      expect(document.activeElement).toBe(controls[4])
      await userEvent.keyboard('{Home}')
      expect(document.activeElement).toBe(controls[0])
      await userEvent.keyboard('{End}')
      expect(document.activeElement).toBe(controls[4])
    },
  )

  it('opens from the keyboard, enters content and restores trigger focus on Escape', async () => {
    const menu = setup()
    menu.controls()[0]!.focus()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(menu.value.value).toBe('one'))
    await vi.waitFor(() => expect(menu.content()?.querySelector('a')).not.toBeNull())
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('one first'))
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(menu.value.value).toBe(''))
    expect(document.activeElement).toBe(menu.controls()[0])
  })

  it.each(['ltr', 'rtl'])(
    'vertical %s opens toward inline end and supports entry keys',
    async dir => {
      const menu = setup({ orientation: 'vertical', dir }, dir)
      const controls = menu.controls()
      const arrow = controls[1]!.querySelector<SVGSVGElement>('.lucide-chevron-right')!
      const closedMatrix = arrow.getScreenCTM()!
      expect(Math.sign(closedMatrix.a)).toBe(dir === 'rtl' ? -1 : 1)
      controls[0]!.focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(document.activeElement).toBe(controls[1])
      await userEvent.keyboard('{Enter}')
      await vi.waitFor(() => expect(menu.viewport()?.clientWidth).toBeGreaterThan(120))
      await vi.waitFor(() => expect(getComputedStyle(arrow.parentElement!).rotate).toBe('90deg'))
      expect(arrow.getScreenCTM()!.b).toBeGreaterThan(0)
      const root = menu.root.getBoundingClientRect()
      const viewport = menu.viewport().getBoundingClientRect()
      if (dir === 'rtl') expect(viewport.right).toBeLessThan(root.left)
      else expect(viewport.left).toBeGreaterThan(root.right)
      expect(viewport.left).toBeGreaterThanOrEqual(0)
      expect(viewport.right).toBeLessThanOrEqual(window.innerWidth)
      await userEvent.keyboard(dir === 'rtl' ? '{ArrowLeft}' : '{ArrowRight}')
      await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('two first'))
    },
  )

  it('hover can move from a trigger into its panel and an exiting panel cannot reopen itself', async () => {
    const menu = setup({ trigger: 'hover', delayDuration: 0 })
    await userEvent.hover(menu.controls()[0]!)
    await vi.waitFor(() => expect(menu.value.value).toBe('one'))
    await vi.waitFor(() => expect(menu.viewport()?.clientWidth).toBe(288))
    await userEvent.hover(menu.content().querySelector('a')!)
    expect(menu.value.value).toBe('one')
    await userEvent.unhover(menu.root)
    await vi.waitFor(() => expect(menu.value.value).toBe(''))
    const viewport = menu.viewport()
    if (viewport) expect(getComputedStyle(viewport).pointerEvents).toBe('none')
    await vi.waitFor(() => expect(menu.viewport()).toBeNull())
    expect(menu.value.value).toBe('')
  })

  it('click-only menus ignore hover and dismiss on outside pointer interaction', async () => {
    const menu = setup()
    await userEvent.hover(menu.controls()[0]!)
    expect(menu.value.value).toBe('')
    await userEvent.click(menu.controls()[0]!)
    await vi.waitFor(() => expect(menu.value.value).toBe('one'))
    const outside = document.createElement('button')
    outside.textContent = 'outside'
    document.body.appendChild(outside)
    await userEvent.click(outside)
    await vi.waitFor(() => expect(menu.value.value).toBe(''))
  })

  it('selecting a panel link dismisses the menu', async () => {
    const menu = setup()
    await userEvent.click(menu.controls()[0]!)
    await vi.waitFor(() => expect(menu.content()?.querySelector('a')).not.toBeNull())
    await userEvent.click(menu.content().querySelector('a')!)
    await vi.waitFor(() => expect(menu.value.value).toBe(''))
  })

  it('has accessible open content and a working focus proxy', async () => {
    const menu = setup()
    await userEvent.click(menu.controls()[0]!)
    await vi.waitFor(() => expect(menu.viewport()?.clientWidth).toBe(288))
    const result = await axe.run(menu.content())
    expect(
      result.violations.map(
        violation => `${violation.id}: ${violation.nodes.map(node => node.html).join(', ')}`,
      ),
    ).toEqual([])
    menu.controls()[0]!.focus()
    await userEvent.tab()
    await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('one first'))
  })

  it('preserves hidden content when requested and keeps it out of the tab order', async () => {
    const menu = setup({ unmountOnHide: false })
    await userEvent.click(menu.controls()[0]!)
    await vi.waitFor(() => expect(menu.content()).not.toBeNull())
    const content = menu.content()
    await userEvent.click(menu.controls()[0]!)
    await vi.waitFor(() => expect(menu.viewport().hidden).toBe(true))
    expect(content.isConnected).toBe(true)
    expect(getComputedStyle(menu.viewport()).display).toBe('none')
    await userEvent.click(menu.controls()[0]!)
    await vi.waitFor(() => expect(menu.viewport().hidden).toBe(false))
    expect(menu.content()).toBe(content)
  })

  it('flips a vertical panel when its preferred side has no room', async () => {
    const menu = setup({ orientation: 'vertical', dir: 'rtl' })
    await userEvent.click(menu.controls()[0]!)
    await vi.waitFor(() => expect(menu.viewport()?.clientWidth).toBeGreaterThan(120))
    expect(menu.viewport().dataset.side).toBe('right')
    const viewport = menu.viewport().getBoundingClientRect()
    expect(viewport.left).toBeGreaterThan(menu.root.getBoundingClientRect().right)
    expect(viewport.right).toBeLessThanOrEqual(window.innerWidth)
  })

  it('keeps panels inside a clipping ancestor as that ancestor resizes', async () => {
    const menu = setup()
    const host = menu.root.parentElement!
    host.style.cssText =
      'padding: 20px; width: 310px; height: 400px; overflow: hidden; margin-inline-start: 30px'
    await userEvent.click(menu.controls()[1]!)
    for (const width of [310, 240]) {
      host.style.width = `${width}px`
      await vi.waitFor(() => {
        const outer = host.getBoundingClientRect()
        const panel = menu.viewport().getBoundingClientRect()
        expect(panel.width).toBeGreaterThan(120)
        expect(panel.width).toBeLessThan(outer.width)
        expect(panel.left).toBeGreaterThan(outer.left)
        expect(panel.right).toBeLessThan(outer.right)
      })
    }
  })
})
