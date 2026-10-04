import { h, type VNode } from 'vue'
import type { ReactNode } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import { ConfigProvider as VConfigProvider } from 'reka-ui'
import VTooltip from '@hina-ui/vue/components/tooltip/Tooltip.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import VPopover from '@hina-ui/vue/components/popover/Popover.vue'
import VDropdownMenu from '@hina-ui/vue/components/dropdown-menu/DropdownMenu.vue'
import VDropdownMenuItem from '@hina-ui/vue/components/dropdown-menu/DropdownMenuItem.vue'
import VDropdownMenuSub from '@hina-ui/vue/components/dropdown-menu/DropdownMenuSub.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { ConfigProvider } from '@hina-ui/react/lib/config'
import { Tooltip } from '@hina-ui/react/components/tooltip/Tooltip'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { Popover } from '@hina-ui/react/components/popover/Popover'
import { DropdownMenu } from '@hina-ui/react/components/dropdown-menu/DropdownMenu'
import { DropdownMenuItem } from '@hina-ui/react/components/dropdown-menu/DropdownMenuItem'
import { DropdownMenuSub } from '@hina-ui/react/components/dropdown-menu/DropdownMenuSub'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'

function wrappers() {
  return [...document.querySelectorAll<HTMLElement>(wrapperSelector)]
}

async function positioned(count = 1) {
  await vi.waitFor(() => {
    const found = wrappers()
    if (found.length !== count) throw new Error(`expected ${count} poppers, found ${found.length}`)
    for (const wrapper of found)
      if (wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  for (const wrapper of wrappers()) {
    const content = wrapper.firstElementChild
    if (content)
      await Promise.allSettled(content.getAnimations().map(animation => animation.finished))
  }
  await frames()
}

async function detached() {
  await positioned()
  await vi.waitFor(() => {
    if (wrappers()[0]?.style.visibility !== 'hidden') throw new Error('still attached')
  })
  await frames()
}

function focusOn(text: string) {
  return vi.waitFor(() => {
    if (document.activeElement?.textContent?.trim() !== text)
      throw new Error(`focus is on ${document.activeElement?.outerHTML}`)
  })
}

const click = async (container: HTMLElement) => {
  await userEvent.click(container.querySelector('button')!)
}

const fixed = (left: number, top: number) => `position:fixed;left:${left}px;top:${top}px`
const reactFixed = (left: number, top: number) => ({ position: 'fixed', left, top }) as const

const vueRtl = (child: () => VNode) => () => h(VConfigProvider, { dir: 'rtl' }, child)
const reactRtl = (child: () => ReactNode) => () => (
  <ConfigProvider dir="rtl">{child()}</ConfigProvider>
)

const vuePanel = () => [h('p', 'Panel'), h('button', { type: 'button' }, 'Action')]
const reactPanel = (
  <>
    <p>Panel</p>
    <button type="button">Action</button>
  </>
)

function popover(
  props: Record<string, unknown>,
  left: number,
  top: number,
): Pick<LiveCase, 'vue' | 'react'> {
  return {
    vue: () =>
      h(
        VPopover,
        { open: true, modal: false, ...props },
        {
          default: () => h(VButton, { style: fixed(left, top) }, () => 'Open'),
          content: vuePanel,
        },
      ),
    react: () => (
      <Popover open modal={false} {...props} content={reactPanel}>
        <Button style={reactFixed(left, top)}>Open</Button>
      </Popover>
    ),
  }
}

const vueItems = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, index) => h(VDropdownMenuItem, () => `${prefix} ${index + 1}`))
const reactItems = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, index) => (
    <DropdownMenuItem key={index}>{`${prefix} ${index + 1}`}</DropdownMenuItem>
  ))

function submenu(
  props: Record<string, unknown>,
  left: number,
  top: number,
  rows: number,
): Pick<LiveCase, 'vue' | 'react'> {
  return {
    vue: () =>
      h(
        VDropdownMenu,
        { label: 'Actions', align: 'start', ...props },
        {
          default: () => h(VButton, { style: fixed(left, top) }, () => 'Open'),
          content: () => [
            h(VDropdownMenuItem, () => 'Copy'),
            h(VDropdownMenuItem, () => 'Paste'),
            h(VDropdownMenuSub, { label: 'Export' }, () => vueItems('Format', rows)),
          ],
        },
      ),
    react: () => (
      <DropdownMenu
        label="Actions"
        align="start"
        {...props}
        content={
          <>
            <DropdownMenuItem>Copy</DropdownMenuItem>
            <DropdownMenuItem>Paste</DropdownMenuItem>
            <DropdownMenuSub label="Export">{reactItems('Format', rows)}</DropdownMenuSub>
          </>
        }
      >
        <Button style={reactFixed(left, top)}>Open</Button>
      </DropdownMenu>
    ),
  }
}

function openSubmenu(key: '{ArrowRight}' | '{ArrowLeft}') {
  return async (container: HTMLElement) => {
    await click(container)
    await positioned()
    await userEvent.keyboard(`{End}${key}`)
  }
}

const submenuOpened = async () => {
  await positioned(2)
  await focusOn('Format 1')
  await frames()
}

const tooltipCase = (props: Record<string, unknown>, left: number, top: number) => ({
  vue: () =>
    h(VTooltipProvider, null, () =>
      h(VTooltip, { content: 'Saved to the library', open: true, ...props }, () =>
        h('button', { type: 'button', style: fixed(left, top) }, 'Save'),
      ),
    ),
  react: () => (
    <TooltipProvider>
      <Tooltip content="Saved to the library" open {...props}>
        <button type="button" style={reactFixed(left, top)}>
          Save
        </button>
      </Tooltip>
    </TooltipProvider>
  ),
})

const vueVirtual = (rect: DOMRect) => ({ getBoundingClientRect: () => rect })

export default defineLiveCases('Popper', [
  {
    name: 'submenu that collides with the inline end edge flips to the other side',
    ...submenu({}, 220, 120, 3),
    interact: openSubmenu('{ArrowRight}'),
    settle: submenuOpened,
  },
  {
    name: 'submenu that fits neither side shifts across the cross axis and along the block axis',
    ...submenu({}, 120, 600, 12),
    interact: openSubmenu('{ArrowRight}'),
    settle: submenuOpened,
  },
  {
    name: 'rtl submenu that collides with the inline start edge flips to the right',
    ...submenu({ dir: 'rtl' }, 60, 120, 3),
    interact: openSubmenu('{ArrowLeft}'),
    settle: submenuOpened,
  },
  {
    name: 'rtl tooltip whose arrow cannot be centered mirrors the start transform-origin',
    vue: vueRtl(tooltipCase({ side: 'bottom', align: 'start' }, -30, 200).vue),
    react: reactRtl(tooltipCase({ side: 'bottom', align: 'start' }, -30, 200).react),
    settle: () => positioned(),
  },
  {
    name: 'rtl tooltip with a centered arrow',
    vue: vueRtl(tooltipCase({ side: 'bottom', align: 'end' }, 160, 200).vue),
    react: reactRtl(tooltipCase({ side: 'bottom', align: 'end' }, 160, 200).react),
    settle: () => positioned(),
  },
  ...(['start', 'end'] as const).map(align => ({
    name: `rtl popover aligned ${align} mirrors the transform-origin`,
    vue: vueRtl(popover({ align }, 160, 200).vue),
    react: reactRtl(popover({ align }, 160, 200).react),
    settle: () => positioned(),
  })),
  ...(['start', 'end'] as const).map(align => ({
    name: `rtl dropdown menu from the config provider aligned ${align}`,
    vue: vueRtl(submenu({ align, open: true }, 160, 200, 2).vue),
    react: reactRtl(submenu({ align, open: true }, 160, 200, 2).react),
    settle: () => positioned(),
  })),
  {
    name: 'popover at the block end edge flips to the top',
    ...popover({ side: 'bottom' }, 160, 850),
    settle: () => positioned(),
  },
  {
    name: 'popover at the block start edge flips to the bottom',
    ...popover({ side: 'top' }, 160, 4),
    settle: () => positioned(),
  },
  {
    name: 'sideFlip false keeps the requested side at the edge',
    ...popover({ side: 'bottom', sideFlip: false }, 160, 850),
    settle: () => positioned(),
  },
  {
    name: 'prioritized popover at the inline end edge flips its alignment',
    ...popover({ side: 'bottom', align: 'start', prioritizePosition: true }, 360, 200),
    settle: () => positioned(),
  },
  {
    name: 'prioritized popover with alignFlip false shifts instead',
    ...popover(
      { side: 'bottom', align: 'start', prioritizePosition: true, alignFlip: false },
      360,
      200,
    ),
    settle: () => positioned(),
  },
  {
    name: 'prioritized popover in the bottom corner flips its side before shifting',
    ...popover({ side: 'bottom', align: 'end', prioritizePosition: true }, 4, 860),
    settle: () => positioned(),
  },
  {
    name: 'dropdown menu on the right at the inline end edge flips to the left',
    ...submenu({ side: 'right', open: true }, 330, 300, 2),
    settle: () => positioned(),
  },
  {
    name: 'virtual reference in the bottom inline end corner',
    vue: () =>
      h(
        VPopover,
        {
          anchor: vueVirtual(new DOMRect(400, 880, 0, 0)),
          open: true,
          modal: false,
          align: 'start',
        },
        { content: vuePanel },
      ),
    react: () => (
      <Popover
        anchor={vueVirtual(new DOMRect(400, 880, 0, 0))}
        open
        modal={false}
        align="start"
        content={reactPanel}
      />
    ),
    settle: () => positioned(),
  },
  {
    name: 'prioritized virtual point reference near the inline end edge',
    vue: () =>
      h(
        VDropdownMenu,
        {
          anchor: vueVirtual(new DOMRect(380, 300, 0, 0)),
          open: true,
          modal: false,
          side: 'right',
          align: 'start',
          prioritizePosition: true,
          label: 'Virtual',
        },
        { content: () => vueItems('Item', 3) },
      ),
    react: () => (
      <DropdownMenu
        anchor={vueVirtual(new DOMRect(380, 300, 0, 0))}
        open
        modal={false}
        side="right"
        align="start"
        {...({ prioritizePosition: true } as object)}
        label="Virtual"
        content={reactItems('Item', 3)}
      />
    ),
    settle: () => positioned(),
  },
  {
    name: 'hideWhenDetached hides the content once the page scrolls the anchor out of view',
    vue: () =>
      h('div', { style: 'position:relative;height:2400px' }, [
        h(
          VPopover,
          { open: true, modal: false, hideWhenDetached: true },
          {
            default: () =>
              h(VButton, { style: 'position:absolute;left:160px;top:300px' }, () => 'Open'),
            content: vuePanel,
          },
        ),
      ]),
    react: () => (
      <div style={{ position: 'relative', height: 2400 }}>
        <Popover
          open
          modal={false}
          {...({ hideWhenDetached: true } as object)}
          content={reactPanel}
        >
          <Button style={{ position: 'absolute', left: 160, top: 300 }}>Open</Button>
        </Popover>
      </div>
    ),
    interact: async () => {
      await positioned()
      window.scrollTo(0, 1200)
    },
    settle: detached,
  },
  {
    name: 'hideWhenDetached keeps the content while a scroll container clips an anchor still in the viewport',
    vue: () =>
      h(
        'div',
        {
          'data-scroller': '',
          style: 'position:fixed;left:40px;top:200px;width:300px;height:120px;overflow:auto',
        },
        [
          h('div', { style: 'height:600px;padding-top:20px' }, [
            h(
              VPopover,
              { open: true, modal: false, hideWhenDetached: true },
              {
                default: () => h(VButton, () => 'Open'),
                content: vuePanel,
              },
            ),
          ]),
        ],
      ),
    react: () => (
      <div
        data-scroller=""
        style={{
          position: 'fixed',
          left: 40,
          top: 200,
          width: 300,
          height: 120,
          overflow: 'auto',
        }}
      >
        <div style={{ height: 600, paddingTop: 20 }}>
          <Popover
            open
            modal={false}
            {...({ hideWhenDetached: true } as object)}
            content={reactPanel}
          >
            <Button>Open</Button>
          </Popover>
        </div>
      </div>
    ),
    interact: async container => {
      await positioned()
      container.querySelector<HTMLElement>('[data-scroller]')!.scrollTop = 200
    },
    settle: async () => {
      await frames(5)
      await positioned()
    },
  },
])
