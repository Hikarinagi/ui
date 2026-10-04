import { defineComponent, h, shallowRef } from 'vue'
import { useState } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VMenubar from '@hina-ui/vue/components/menubar/Menubar.vue'
import VMenubarMenu from '@hina-ui/vue/components/menubar/MenubarMenu.vue'
import VMenubarItem from '@hina-ui/vue/components/menubar/MenubarItem.vue'
import VMenubarCheckboxItem from '@hina-ui/vue/components/menubar/MenubarCheckboxItem.vue'
import VMenubarGroup from '@hina-ui/vue/components/menubar/MenubarGroup.vue'
import VMenubarLabel from '@hina-ui/vue/components/menubar/MenubarLabel.vue'
import VMenubarSeparator from '@hina-ui/vue/components/menubar/MenubarSeparator.vue'
import VMenubarRadioGroup from '@hina-ui/vue/components/menubar/MenubarRadioGroup.vue'
import VMenubarRadioItem from '@hina-ui/vue/components/menubar/MenubarRadioItem.vue'
import VMenubarSub from '@hina-ui/vue/components/menubar/MenubarSub.vue'
import { Menubar } from '@hina-ui/react/components/menubar/Menubar'
import { MenubarMenu } from '@hina-ui/react/components/menubar/MenubarMenu'
import { MenubarItem } from '@hina-ui/react/components/menubar/MenubarItem'
import { MenubarCheckboxItem } from '@hina-ui/react/components/menubar/MenubarCheckboxItem'
import { MenubarGroup } from '@hina-ui/react/components/menubar/MenubarGroup'
import { MenubarLabel } from '@hina-ui/react/components/menubar/MenubarLabel'
import { MenubarSeparator } from '@hina-ui/react/components/menubar/MenubarSeparator'
import { MenubarRadioGroup } from '@hina-ui/react/components/menubar/MenubarRadioGroup'
import { MenubarRadioItem } from '@hina-ui/react/components/menubar/MenubarRadioItem'
import { MenubarSub } from '@hina-ui/react/components/menubar/MenubarSub'
import { defineLiveCases, frames } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'

async function positioned(count = 1) {
  await vi.waitFor(() => {
    const wrappers = document.querySelectorAll<HTMLElement>(wrapperSelector)
    if (wrappers.length !== count) throw new Error(`expected ${count} menus`)
    for (const wrapper of wrappers)
      if (wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
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

function focusOn(text: string) {
  return vi.waitFor(() => {
    if (document.activeElement?.textContent?.trim() !== text)
      throw new Error(`focus is on ${document.activeElement?.outerHTML}`)
  })
}

const barStyle = 'position:fixed;left:16px;top:40px'

const vueMenus = () => [
  h(VMenubarMenu, { label: 'File', value: 'file' }, () => [
    h(VMenubarGroup, () => [
      h(VMenubarLabel, () => 'Document'),
      h(VMenubarItem, {}, { icon: () => h('svg', { 'data-icon': '' }), default: () => 'New' }),
      h(VMenubarItem, {}, { default: () => 'Open', trailing: () => h('kbd', 'O') }),
    ]),
    h(VMenubarSeparator),
    h(VMenubarSub, { label: 'Export' }, () => [
      h(VMenubarItem, () => 'PDF'),
      h(VMenubarItem, () => 'EPUB'),
    ]),
    h(VMenubarItem, { tone: 'danger' }, () => 'Delete'),
    h(VMenubarItem, { disabled: true }, () => 'Archive'),
  ]),
  h(VMenubarMenu, { label: 'View', value: 'view' }, () => [
    h(VMenubarCheckboxItem, { checked: true }, () => 'Grid'),
    h(VMenubarCheckboxItem, { checked: false }, () => 'Rulers'),
    h(VMenubarSeparator),
    h(VMenubarRadioGroup, { modelValue: 'fit' }, () => [
      h(VMenubarRadioItem, { value: 'fit' }, () => 'Fit'),
      h(VMenubarRadioItem, { value: 'fill' }, () => 'Fill'),
      h(VMenubarRadioItem, { value: 'actual', disabled: true }, () => 'Actual'),
    ]),
  ]),
  h(VMenubarMenu, { label: 'Help', value: 'help', disabled: true }, () =>
    h(VMenubarItem, () => 'About'),
  ),
  h(VMenubarMenu, { label: 'Window', value: 'window', class: 'w-56' }, () =>
    h(VMenubarItem, () => 'Minimize'),
  ),
]
const reactMenus = (
  <>
    <MenubarMenu label="File" value="file">
      <MenubarGroup>
        <MenubarLabel>Document</MenubarLabel>
        <MenubarItem icon={<svg data-icon="" />}>New</MenubarItem>
        <MenubarItem trailing={<kbd>O</kbd>}>Open</MenubarItem>
      </MenubarGroup>
      <MenubarSeparator />
      <MenubarSub label="Export">
        <MenubarItem>PDF</MenubarItem>
        <MenubarItem>EPUB</MenubarItem>
      </MenubarSub>
      <MenubarItem tone="danger">Delete</MenubarItem>
      <MenubarItem disabled>Archive</MenubarItem>
    </MenubarMenu>
    <MenubarMenu label="View" value="view">
      <MenubarCheckboxItem checked>Grid</MenubarCheckboxItem>
      <MenubarCheckboxItem checked={false}>Rulers</MenubarCheckboxItem>
      <MenubarSeparator />
      <MenubarRadioGroup value="fit">
        <MenubarRadioItem value="fit">Fit</MenubarRadioItem>
        <MenubarRadioItem value="fill">Fill</MenubarRadioItem>
        <MenubarRadioItem value="actual" disabled>
          Actual
        </MenubarRadioItem>
      </MenubarRadioGroup>
    </MenubarMenu>
    <MenubarMenu label="Help" value="help" disabled>
      <MenubarItem>About</MenubarItem>
    </MenubarMenu>
    <MenubarMenu label="Window" value="window" className="w-56">
      <MenubarItem>Minimize</MenubarItem>
    </MenubarMenu>
  </>
)

function vueBar(props: Record<string, unknown> = {}) {
  return () => h(VMenubar, { label: 'Application', style: barStyle, ...props }, vueMenus)
}

function reactBar(props: Record<string, unknown> = {}) {
  return () => (
    <Menubar label="Application" style={{ position: 'fixed', left: 16, top: 40 }} {...props}>
      {reactMenus}
    </Menubar>
  )
}

const trigger = (text: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="menubar"] button')].find(
    element => element.textContent?.trim() === text,
  )!

const item = (text: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="menu"] [role^="menuitem"]')].find(
    element => element.textContent?.trim() === text,
  )!

export default defineLiveCases('Menubar', [
  {
    name: 'closed bar',
    vue: vueBar(),
    react: reactBar(),
    settle: closed,
  },
  {
    name: 'click opens a menu with groups, labels, separators, disabled items and a submenu trigger',
    vue: vueBar(),
    react: reactBar(),
    interact: async () => {
      await userEvent.click(trigger('File'))
    },
    settle: () => positioned(),
  },
  {
    name: 'checkbox and radio states in a menu',
    vue: vueBar(),
    react: reactBar(),
    interact: async () => {
      await userEvent.click(trigger('View'))
    },
    settle: () => positioned(),
  },
  {
    name: 'hovering another trigger switches the open menu',
    vue: vueBar(),
    react: reactBar(),
    interact: async () => {
      await userEvent.click(trigger('File'))
      await positioned()
      await userEvent.hover(trigger('View'))
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (!item('Grid')) throw new Error('view menu not open')
      })
      await positioned()
    },
  },
  {
    name: 'ArrowDown on a focused trigger opens and focuses the first item',
    vue: vueBar(),
    react: reactBar(),
    interact: async () => {
      await userEvent.tab()
      await userEvent.keyboard('{ArrowDown}')
    },
    settle: async () => {
      await positioned()
      await focusOn('New')
      await frames()
    },
  },
  {
    name: 'ArrowRight on a clicked trigger roves focus past disabled triggers',
    vue: vueBar(),
    react: reactBar(),
    interact: async () => {
      await userEvent.click(trigger('View'))
      await positioned()
      await userEvent.keyboard('{ArrowRight}')
    },
    settle: async () => {
      await focusOn('Window')
      await positioned()
    },
  },
  {
    name: 'ArrowRight inside an open menu switches to the next enabled menu',
    vue: vueBar(),
    react: reactBar(),
    interact: async () => {
      await userEvent.tab()
      await userEvent.keyboard('{ArrowRight}{ArrowDown}')
      await focusOn('Grid')
      await userEvent.keyboard('{ArrowRight}')
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (!item('Minimize')) throw new Error('window menu not open')
      })
      await positioned()
    },
  },
  {
    name: 'ArrowLeft from the first menu loops to the last menu',
    vue: vueBar(),
    react: reactBar(),
    interact: async () => {
      await userEvent.tab()
      await userEvent.keyboard('{ArrowDown}')
      await focusOn('New')
      await userEvent.keyboard('{ArrowLeft}')
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (!item('Minimize')) throw new Error('window menu not open')
      })
      await positioned()
    },
  },
  {
    name: 'non-looping bar stops at the last menu',
    vue: vueBar({ loop: false }),
    react: reactBar({ loop: false }),
    interact: async () => {
      await userEvent.tab()
      await userEvent.keyboard('{ArrowLeft}{ArrowDown}')
      await positioned()
      await userEvent.keyboard('{ArrowRight}')
    },
    settle: async () => {
      await frames(6)
      await positioned()
    },
  },
  {
    name: 'submenu opens with the keyboard inside a menubar menu',
    vue: vueBar(),
    react: reactBar(),
    interact: async () => {
      await userEvent.tab()
      await userEvent.keyboard('{ArrowDown}')
      await focusOn('New')
      await positioned()
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}')
    },
    settle: async () => {
      await positioned(2)
      await focusOn('PDF')
      await frames()
    },
  },
  {
    name: 'submenu opens on hover inside a menubar menu',
    vue: vueBar(),
    react: reactBar(),
    interact: async () => {
      await userEvent.click(trigger('File'))
      await positioned()
      await userEvent.hover(item('Export'))
    },
    settle: () => positioned(2),
  },
  {
    name: 'toggling a checkbox keeps the menu open',
    vue: () =>
      h(
        defineComponent({
          setup() {
            const grid = shallowRef(false)
            return () =>
              h(VMenubar, { style: barStyle }, () =>
                h(VMenubarMenu, { label: 'View', value: 'view' }, () =>
                  h(
                    VMenubarCheckboxItem,
                    {
                      checked: grid.value,
                      'onUpdate:checked': (value: boolean) => (grid.value = value),
                    },
                    () => 'Grid',
                  ),
                ),
              )
          },
        }),
      ),
    react: () => {
      function Harness() {
        const [grid, setGrid] = useState(false)
        return (
          <Menubar style={{ position: 'fixed', left: 16, top: 40 }}>
            <MenubarMenu label="View" value="view">
              <MenubarCheckboxItem checked={grid} onCheckedChange={setGrid}>
                Grid
              </MenubarCheckboxItem>
            </MenubarMenu>
          </Menubar>
        )
      }
      return <Harness />
    },
    interact: async () => {
      await userEvent.click(trigger('View'))
      await positioned()
      await userEvent.click(item('Grid'))
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (item('Grid').getAttribute('aria-checked') !== 'true') throw new Error('unchecked')
      })
      await positioned()
    },
  },
  {
    name: 'selecting an item closes the menu',
    vue: vueBar(),
    react: reactBar(),
    interact: async () => {
      await userEvent.click(trigger('File'))
      await positioned()
      await userEvent.click(item('Delete'))
    },
    settle: closed,
  },
  {
    name: 'Escape closes and returns focus to the trigger',
    vue: vueBar(),
    react: reactBar(),
    interact: async () => {
      await userEvent.click(trigger('File'))
      await positioned()
      await userEvent.keyboard('{Escape}')
    },
    settle: async () => {
      await closed()
      await focusOn('File')
    },
  },
  {
    name: 'rtl bar opens the menu at the inline start',
    vue: vueBar({ dir: 'rtl', style: 'position:fixed;left:120px;top:40px' }),
    react: reactBar({ dir: 'rtl', style: { position: 'fixed', left: 120, top: 40 } }),
    interact: async () => {
      await userEvent.click(trigger('File'))
    },
    settle: () => positioned(),
  },
])
