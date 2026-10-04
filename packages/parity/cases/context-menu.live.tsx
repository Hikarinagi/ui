import { defineComponent, h, shallowRef } from 'vue'
import { useState } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VContextMenu from '@hina-ui/vue/components/context-menu/ContextMenu.vue'
import VContextMenuItem from '@hina-ui/vue/components/context-menu/ContextMenuItem.vue'
import VContextMenuCheckboxItem from '@hina-ui/vue/components/context-menu/ContextMenuCheckboxItem.vue'
import VContextMenuGroup from '@hina-ui/vue/components/context-menu/ContextMenuGroup.vue'
import VContextMenuLabel from '@hina-ui/vue/components/context-menu/ContextMenuLabel.vue'
import VContextMenuSeparator from '@hina-ui/vue/components/context-menu/ContextMenuSeparator.vue'
import VContextMenuRadioGroup from '@hina-ui/vue/components/context-menu/ContextMenuRadioGroup.vue'
import VContextMenuRadioItem from '@hina-ui/vue/components/context-menu/ContextMenuRadioItem.vue'
import VContextMenuSub from '@hina-ui/vue/components/context-menu/ContextMenuSub.vue'
import { ContextMenu } from '@hina-ui/react/components/context-menu/ContextMenu'
import { ContextMenuItem } from '@hina-ui/react/components/context-menu/ContextMenuItem'
import { ContextMenuCheckboxItem } from '@hina-ui/react/components/context-menu/ContextMenuCheckboxItem'
import { ContextMenuGroup } from '@hina-ui/react/components/context-menu/ContextMenuGroup'
import { ContextMenuLabel } from '@hina-ui/react/components/context-menu/ContextMenuLabel'
import { ContextMenuSeparator } from '@hina-ui/react/components/context-menu/ContextMenuSeparator'
import { ContextMenuRadioGroup } from '@hina-ui/react/components/context-menu/ContextMenuRadioGroup'
import { ContextMenuRadioItem } from '@hina-ui/react/components/context-menu/ContextMenuRadioItem'
import { ContextMenuSub } from '@hina-ui/react/components/context-menu/ContextMenuSub'
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

const areaStyle = 'position:fixed;left:20px;top:80px;width:240px;height:160px'
const reactAreaStyle = { position: 'fixed', left: 20, top: 80, width: 240, height: 160 } as const

const vueContent = () => [
  h(VContextMenuGroup, () => [
    h(VContextMenuLabel, () => 'File'),
    h(VContextMenuItem, {}, { icon: () => h('svg', { 'data-icon': '' }), default: () => 'Copy' }),
    h(VContextMenuItem, {}, { default: () => 'Cut', trailing: () => h('kbd', 'X') }),
  ]),
  h(VContextMenuSeparator),
  h(VContextMenuCheckboxItem, { checked: true }, () => 'Pinned'),
  h(VContextMenuCheckboxItem, { checked: false }, () => 'Starred'),
  h(VContextMenuRadioGroup, { modelValue: 'list' }, () => [
    h(VContextMenuRadioItem, { value: 'list' }, () => 'List'),
    h(VContextMenuRadioItem, { value: 'grid', disabled: true }, () => 'Grid'),
  ]),
  h(VContextMenuSub, { label: 'Move to' }, () => [
    h(VContextMenuItem, () => 'Favorites'),
    h(VContextMenuItem, () => 'Archive'),
  ]),
  h(VContextMenuItem, { tone: 'danger' }, () => 'Delete'),
  h(VContextMenuItem, { disabled: true }, () => 'Rename'),
]
const reactContent = (
  <>
    <ContextMenuGroup>
      <ContextMenuLabel>File</ContextMenuLabel>
      <ContextMenuItem icon={<svg data-icon="" />}>Copy</ContextMenuItem>
      <ContextMenuItem trailing={<kbd>X</kbd>}>Cut</ContextMenuItem>
    </ContextMenuGroup>
    <ContextMenuSeparator />
    <ContextMenuCheckboxItem checked>Pinned</ContextMenuCheckboxItem>
    <ContextMenuCheckboxItem checked={false}>Starred</ContextMenuCheckboxItem>
    <ContextMenuRadioGroup value="list">
      <ContextMenuRadioItem value="list">List</ContextMenuRadioItem>
      <ContextMenuRadioItem value="grid" disabled>
        Grid
      </ContextMenuRadioItem>
    </ContextMenuRadioGroup>
    <ContextMenuSub label="Move to">
      <ContextMenuItem>Favorites</ContextMenuItem>
      <ContextMenuItem>Archive</ContextMenuItem>
    </ContextMenuSub>
    <ContextMenuItem tone="danger">Delete</ContextMenuItem>
    <ContextMenuItem disabled>Rename</ContextMenuItem>
  </>
)

function vueMenu(props: Record<string, unknown> = {}) {
  return () =>
    h(
      VContextMenu,
      { label: 'File actions', ...props },
      {
        default: () => h('div', { 'data-area': '', style: areaStyle }, 'Right click'),
        content: vueContent,
      },
    )
}

function reactMenu(props: Record<string, unknown> = {}) {
  return () => (
    <ContextMenu label="File actions" {...props} content={reactContent}>
      <div data-area="" style={reactAreaStyle}>
        Right click
      </div>
    </ContextMenu>
  )
}

const area = () => document.querySelector<HTMLElement>('[data-area]')!
const rightClick = async (x = 40, y = 30) => {
  await userEvent.click(area(), { button: 'right', position: { x, y } })
}

const item = (text: string) =>
  [...document.querySelectorAll<HTMLElement>('[role^="menuitem"]')].find(
    element => element.textContent?.trim() === text,
  )!

export default defineLiveCases('ContextMenu', [
  {
    name: 'closed by default',
    vue: vueMenu(),
    react: reactMenu(),
    settle: closed,
  },
  {
    name: 'right click opens at the pointer with every item kind',
    vue: vueMenu(),
    react: reactMenu(),
    interact: () => rightClick(),
    settle: () => positioned(),
  },
  {
    name: 'class reaches the panel',
    vue: vueMenu({ class: 'w-56' }),
    react: reactMenu({ className: 'w-56' }),
    interact: () => rightClick(60, 20),
    settle: () => positioned(),
  },
  {
    name: 'right click again repositions the open menu',
    vue: vueMenu(),
    react: reactMenu(),
    interact: async () => {
      await rightClick()
      await positioned()
      await rightClick(10, 140)
    },
    settle: async () => {
      await vi.waitFor(() => {
        const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
        if (!wrapper?.style.transform.startsWith('translate(32px')) throw new Error('not moved')
      })
      await positioned()
    },
  },
  {
    name: 'keyboard navigation highlights items',
    vue: vueMenu(),
    react: reactMenu(),
    interact: async () => {
      await rightClick()
      await positioned()
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
    },
    settle: async () => {
      await focusOn('Pinned')
      await frames()
    },
  },
  {
    name: 'hover opens the submenu',
    vue: vueMenu(),
    react: reactMenu(),
    interact: async () => {
      await rightClick()
      await positioned()
      await userEvent.hover(item('Move to'))
    },
    settle: async () => {
      await positioned(2)
      await frames()
    },
  },
  {
    name: 'keyboard opens the submenu and focuses its first item',
    vue: vueMenu(),
    react: reactMenu(),
    interact: async () => {
      await rightClick()
      await positioned()
      await userEvent.hover(item('Starred'))
      await focusOn('Starred')
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}')
    },
    settle: async () => {
      await positioned(2)
      await focusOn('Favorites')
      await frames()
    },
  },
  {
    name: 'toggling a checkbox item keeps the menu open',
    vue: () =>
      h(
        defineComponent({
          setup() {
            const checked = shallowRef(false)
            return () =>
              h(
                VContextMenu,
                { label: 'View' },
                {
                  default: () => h('div', { 'data-area': '', style: areaStyle }, 'Right click'),
                  content: () =>
                    h(
                      VContextMenuCheckboxItem,
                      {
                        checked: checked.value,
                        'onUpdate:checked': (value: boolean) => (checked.value = value),
                      },
                      () => 'Grid',
                    ),
                },
              )
          },
        }),
      ),
    react: () => {
      function Harness() {
        const [checked, setChecked] = useState(false)
        return (
          <ContextMenu
            label="View"
            content={
              <ContextMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
                Grid
              </ContextMenuCheckboxItem>
            }
          >
            <div data-area="" style={reactAreaStyle}>
              Right click
            </div>
          </ContextMenu>
        )
      }
      return <Harness />
    },
    interact: async () => {
      await rightClick()
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
    vue: vueMenu(),
    react: reactMenu(),
    interact: async () => {
      await rightClick()
      await positioned()
      await userEvent.click(item('Delete'))
    },
    settle: closed,
  },
  {
    name: 'Escape closes the menu',
    vue: vueMenu(),
    react: reactMenu(),
    interact: async () => {
      await rightClick()
      await positioned()
      await userEvent.keyboard('{Escape}')
    },
    settle: closed,
  },
  {
    name: 'disabled trigger does not open',
    vue: vueMenu({ disabled: true }),
    react: reactMenu({ disabled: true }),
    interact: () => rightClick(),
    settle: async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
      await closed()
    },
  },
])
