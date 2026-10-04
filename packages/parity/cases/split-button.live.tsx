import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VSplitButton from '@hina-ui/vue/components/split-button/SplitButton.vue'
import VDropdownMenuItem from '@hina-ui/vue/components/dropdown-menu/DropdownMenuItem.vue'
import { SplitButton } from '@hina-ui/react/components/split-button/SplitButton'
import { DropdownMenuItem } from '@hina-ui/react/components/dropdown-menu/DropdownMenuItem'
import { defineLiveCases, frames } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  for (const panel of document.querySelectorAll<HTMLElement>('[role="menu"]'))
    await Promise.allSettled(panel.getAnimations().map(animation => animation.finished))
  await frames()
}

async function closed() {
  await vi.waitFor(() => {
    if (document.querySelector(wrapperSelector)) throw new Error('still open')
  })
  await frames()
}

const hostStyle = 'position:fixed;left:24px;top:80px;width:320px'
const reactHostStyle = { position: 'fixed', left: 24, top: 80, width: 320 } as const

const vueItems = () => [
  h(VDropdownMenuItem, () => 'Save draft'),
  h(VDropdownMenuItem, { disabled: true }, () => 'Schedule'),
  h(VDropdownMenuItem, () => 'Preview'),
]
const reactItems = () => (
  <>
    <DropdownMenuItem>Save draft</DropdownMenuItem>
    <DropdownMenuItem disabled>Schedule</DropdownMenuItem>
    <DropdownMenuItem>Preview</DropdownMenuItem>
  </>
)

function vueSplit(props: Record<string, unknown> = {}) {
  return () =>
    h('div', { style: hostStyle }, [
      h(
        VSplitButton,
        { menuLabel: 'Publishing options', ...props },
        { default: () => 'Publish', content: vueItems },
      ),
    ])
}

function reactSplit(props: Record<string, unknown> = {}) {
  return () => (
    <div style={reactHostStyle}>
      <SplitButton menuLabel="Publishing options" {...props} renderContent={reactItems}>
        Publish
      </SplitButton>
    </div>
  )
}

const trigger = () => document.querySelector<HTMLElement>('[data-hn-split-trigger]')!
const action = () => document.querySelector<HTMLElement>('[data-hn-split-action]')!

export default defineLiveCases('SplitButton', [
  {
    name: 'closed by default',
    vue: vueSplit(),
    react: reactSplit(),
    settle: closed,
  },
  {
    name: 'menu trigger opens the menu aligned to the group end',
    vue: vueSplit(),
    react: reactSplit(),
    interact: async () => {
      await userEvent.click(trigger())
    },
    settle: positioned,
  },
  {
    name: 'ArrowDown on the primary action opens and focuses the first item',
    vue: vueSplit(),
    react: reactSplit(),
    interact: async () => {
      action().focus()
      await userEvent.keyboard('{ArrowDown}')
    },
    settle: async () => {
      await positioned()
      await vi.waitFor(() => {
        if (document.activeElement?.textContent?.trim() !== 'Save draft')
          throw new Error('first item not focused')
      })
      await frames()
    },
  },
  {
    name: 'block outline group in rtl',
    vue: vueSplit({ block: true, variant: 'outline', dir: 'rtl' }),
    react: reactSplit({ block: true, variant: 'outline', dir: 'rtl' }),
    interact: async () => {
      await userEvent.click(trigger())
    },
    settle: positioned,
  },
  {
    name: 'menu placement, class and size',
    vue: vueSplit({ side: 'top', align: 'start', sideOffset: 4, menuClass: 'w-64', size: 'sm' }),
    react: reactSplit({
      side: 'top',
      align: 'start',
      sideOffset: 4,
      menuClass: 'w-64',
      size: 'sm',
    }),
    interact: async () => {
      await userEvent.click(trigger())
    },
    settle: positioned,
  },
  {
    name: 'non-modal menu',
    vue: vueSplit({ modal: false }),
    react: reactSplit({ modal: false }),
    interact: async () => {
      await userEvent.click(trigger())
    },
    settle: positioned,
  },
  {
    name: 'selecting an item closes and returns focus to the menu trigger',
    vue: vueSplit(),
    react: reactSplit(),
    interact: async () => {
      await userEvent.click(trigger())
      await positioned()
      await userEvent.click(
        [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')].find(
          element => element.textContent?.trim() === 'Preview',
        )!,
      )
    },
    settle: async () => {
      await closed()
      await vi.waitFor(() => {
        if (document.activeElement !== trigger()) throw new Error('focus not restored')
      })
    },
  },
  {
    name: 'loading state stays closed',
    vue: vueSplit({ loading: true }),
    react: reactSplit({ loading: true }),
    interact: async () => {
      await userEvent.click(trigger(), { force: true })
    },
    settle: closed,
  },
])
