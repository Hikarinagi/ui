import { defineComponent, h, shallowRef } from 'vue'
import { useState } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VDropdownMenu from '@hina-ui/vue/components/dropdown-menu/DropdownMenu.vue'
import VDropdownMenuItem from '@hina-ui/vue/components/dropdown-menu/DropdownMenuItem.vue'
import VDropdownMenuCheckboxItem from '@hina-ui/vue/components/dropdown-menu/DropdownMenuCheckboxItem.vue'
import VDropdownMenuGroup from '@hina-ui/vue/components/dropdown-menu/DropdownMenuGroup.vue'
import VDropdownMenuLabel from '@hina-ui/vue/components/dropdown-menu/DropdownMenuLabel.vue'
import VDropdownMenuSeparator from '@hina-ui/vue/components/dropdown-menu/DropdownMenuSeparator.vue'
import VDropdownMenuRadioGroup from '@hina-ui/vue/components/dropdown-menu/DropdownMenuRadioGroup.vue'
import VDropdownMenuRadioItem from '@hina-ui/vue/components/dropdown-menu/DropdownMenuRadioItem.vue'
import VDropdownMenuSub from '@hina-ui/vue/components/dropdown-menu/DropdownMenuSub.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { DropdownMenu } from '@hina-ui/react/components/dropdown-menu/DropdownMenu'
import { DropdownMenuItem } from '@hina-ui/react/components/dropdown-menu/DropdownMenuItem'
import { DropdownMenuCheckboxItem } from '@hina-ui/react/components/dropdown-menu/DropdownMenuCheckboxItem'
import { DropdownMenuGroup } from '@hina-ui/react/components/dropdown-menu/DropdownMenuGroup'
import { DropdownMenuLabel } from '@hina-ui/react/components/dropdown-menu/DropdownMenuLabel'
import { DropdownMenuSeparator } from '@hina-ui/react/components/dropdown-menu/DropdownMenuSeparator'
import { DropdownMenuRadioGroup } from '@hina-ui/react/components/dropdown-menu/DropdownMenuRadioGroup'
import { DropdownMenuRadioItem } from '@hina-ui/react/components/dropdown-menu/DropdownMenuRadioItem'
import { DropdownMenuSub } from '@hina-ui/react/components/dropdown-menu/DropdownMenuSub'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

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

const triggerStyle = 'position:fixed;left:24px;top:120px'
const reactTriggerStyle = { position: 'fixed', left: 24, top: 120 } as const

const vueTrigger = () =>
  h(VButton, { variant: 'outline', tone: 'neutral', style: triggerStyle }, () => 'Open')
const reactTrigger = () => (
  <Button variant="outline" tone="neutral" style={reactTriggerStyle}>
    Open
  </Button>
)

const vueSimple = () => [
  h(VDropdownMenuItem, () => 'Copy'),
  h(VDropdownMenuItem, { tone: 'danger' }, () => 'Delete'),
  h(VDropdownMenuItem, { disabled: true }, () => 'Archive'),
]
const reactSimple = (
  <>
    <DropdownMenuItem>Copy</DropdownMenuItem>
    <DropdownMenuItem tone="danger">Delete</DropdownMenuItem>
    <DropdownMenuItem disabled>Archive</DropdownMenuItem>
  </>
)

const vueFull = () => [
  h(VDropdownMenuGroup, () => [
    h(VDropdownMenuLabel, () => 'Account'),
    h(
      VDropdownMenuItem,
      {},
      { icon: () => h('svg', { 'data-icon': '' }), default: () => 'Profile' },
    ),
    h(VDropdownMenuItem, {}, { default: () => 'Share', trailing: () => h('kbd', 'S') }),
  ]),
  h(VDropdownMenuSeparator),
  h(VDropdownMenuLabel, () => 'View'),
  h(VDropdownMenuCheckboxItem, { checked: true }, () => 'Cover'),
  h(VDropdownMenuCheckboxItem, { checked: false }, () => 'Tags'),
  h(VDropdownMenuCheckboxItem, { checked: true, disabled: true }, () => 'Locked'),
  h(VDropdownMenuSeparator),
  h(VDropdownMenuRadioGroup, { modelValue: 'newest' }, () => [
    h(VDropdownMenuRadioItem, { value: 'newest' }, () => 'Newest'),
    h(VDropdownMenuRadioItem, { value: 'popular' }, () => 'Popular'),
    h(VDropdownMenuRadioItem, { value: 'rating', disabled: true }, () => 'Rating'),
  ]),
  h(VDropdownMenuSeparator),
  h(VDropdownMenuSub, { label: 'Export' }, () => [
    h(VDropdownMenuItem, () => 'PDF'),
    h(VDropdownMenuItem, () => 'EPUB'),
  ]),
  h(VDropdownMenuSub, { label: 'Move', disabled: true }, () => h(VDropdownMenuItem, () => 'Inbox')),
  h(VDropdownMenuItem, { tone: 'danger', disabled: true }, () => 'Delete'),
]
const reactFull = (
  <>
    <DropdownMenuGroup>
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuItem icon={<svg data-icon="" />}>Profile</DropdownMenuItem>
      <DropdownMenuItem trailing={<kbd>S</kbd>}>Share</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuLabel>View</DropdownMenuLabel>
    <DropdownMenuCheckboxItem checked>Cover</DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem checked={false}>Tags</DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem checked disabled>
      Locked
    </DropdownMenuCheckboxItem>
    <DropdownMenuSeparator />
    <DropdownMenuRadioGroup value="newest">
      <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="popular">Popular</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="rating" disabled>
        Rating
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
    <DropdownMenuSeparator />
    <DropdownMenuSub label="Export">
      <DropdownMenuItem>PDF</DropdownMenuItem>
      <DropdownMenuItem>EPUB</DropdownMenuItem>
    </DropdownMenuSub>
    <DropdownMenuSub label="Move" disabled>
      <DropdownMenuItem>Inbox</DropdownMenuItem>
    </DropdownMenuSub>
    <DropdownMenuItem tone="danger" disabled>
      Delete
    </DropdownMenuItem>
  </>
)

function vueMenu(props: Record<string, unknown> = {}, content = vueFull) {
  return () => h(VDropdownMenu, { label: 'Actions', ...props }, { default: vueTrigger, content })
}

function reactMenu(props: Record<string, unknown> = {}, content = reactFull) {
  return () => (
    <DropdownMenu label="Actions" {...props} content={content}>
      {reactTrigger()}
    </DropdownMenu>
  )
}

const click = async (container: HTMLElement) => {
  await userEvent.click(container.querySelector('button')!)
}

const item = (text: string) =>
  [...document.querySelectorAll<HTMLElement>('[role^="menuitem"]')].find(
    element => element.textContent?.trim() === text,
  )!

const sides = ['top', 'right', 'bottom', 'left'] as const
const aligns = ['start', 'center', 'end'] as const

const placement: LiveCase[] = sides.flatMap(side =>
  aligns.map(align => ({
    name: `controlled open on ${side} ${align}`,
    vue: () =>
      h(
        VDropdownMenu,
        { open: true, side, align, label: 'Placement' },
        {
          default: () => h(VButton, { style: 'position:fixed;left:180px;top:300px' }, () => 'Open'),
          content: vueSimple,
        },
      ),
    react: () => (
      <DropdownMenu open side={side} align={align} label="Placement" content={reactSimple}>
        <Button style={{ position: 'fixed', left: 180, top: 300 }}>Open</Button>
      </DropdownMenu>
    ),
    settle: () => positioned(),
  })),
)

const anchorStyle = 'position:fixed;left:120px;top:160px;width:80px;height:30px'

const VueElementAnchor = defineComponent({
  props: { modal: { type: Boolean, default: true } },
  setup(props) {
    const anchor = shallowRef<HTMLElement | null>(null)
    return () => [
      h('button', { ref: anchor, type: 'button', style: anchorStyle }, 'Anchor'),
      h(
        VDropdownMenu,
        { anchor: anchor.value, open: true, modal: props.modal, align: 'start', label: 'External' },
        { content: vueSimple },
      ),
    ]
  },
})

function ReactElementAnchor({ modal = true }: { modal?: boolean }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  return (
    <>
      <button
        ref={setAnchor}
        type="button"
        style={{ position: 'fixed', left: 120, top: 160, width: 80, height: 30 }}
      >
        Anchor
      </button>
      <DropdownMenu
        anchor={anchor}
        open
        modal={modal}
        align="start"
        label="External"
        content={reactSimple}
      />
    </>
  )
}

const virtualRect = { getBoundingClientRect: () => new DOMRect(160, 260, 2, 20) }

const VueContextAnchor = defineComponent({
  setup() {
    const host = shallowRef<HTMLElement | null>(null)
    return () => [
      h('div', { ref: host, style: 'position:fixed;left:40px;top:80px;width:300px;height:200px' }),
      h(
        VDropdownMenu,
        {
          anchor: host.value
            ? {
                getBoundingClientRect: () => new DOMRect(90, 140, 2, 20),
                contextElement: host.value,
              }
            : null,
          open: true,
          modal: false,
          align: 'start',
          updatePositionStrategy: 'always',
          label: 'Context',
        },
        { content: vueSimple },
      ),
    ]
  },
})

function ReactContextAnchor() {
  const [host, setHost] = useState<HTMLElement | null>(null)
  const [anchor] = useState(() => ({ current: null as null | object }))
  if (host && !anchor.current)
    anchor.current = {
      getBoundingClientRect: () => new DOMRect(90, 140, 2, 20),
      contextElement: host,
    }
  return (
    <>
      <div
        ref={setHost}
        style={{ position: 'fixed', left: 40, top: 80, width: 300, height: 200 }}
      />
      <DropdownMenu
        anchor={anchor.current as never}
        open
        modal={false}
        align="start"
        updatePositionStrategy="always"
        label="Context"
        content={reactSimple}
      />
    </>
  )
}

export default defineLiveCases('DropdownMenu', [
  {
    name: 'closed by default',
    vue: vueMenu(),
    react: reactMenu(),
    settle: closed,
  },
  {
    name: 'click opens every item kind: groups, labels, separators, checked states, disabled items and submenu triggers',
    vue: vueMenu({ align: 'start' }),
    react: reactMenu({ align: 'start' }),
    interact: click,
    settle: () => positioned(),
  },
  {
    name: 'non-modal opens without locking the page',
    vue: vueMenu({ modal: false, align: 'start' }, vueSimple),
    react: reactMenu({ modal: false, align: 'start' }, reactSimple),
    interact: click,
    settle: () => positioned(),
  },
  {
    name: 'keyboard Enter opens and focuses the first item',
    vue: vueMenu({ align: 'start' }, vueSimple),
    react: reactMenu({ align: 'start' }, reactSimple),
    interact: async () => {
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
    },
    settle: async () => {
      await positioned()
      await focusOn('Copy')
    },
  },
  {
    name: 'ArrowDown moves the highlight and skips disabled items',
    vue: vueMenu({ align: 'start' }),
    react: reactMenu({ align: 'start' }),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}')
    },
    settle: async () => {
      await focusOn('Newest')
      await frames()
    },
  },
  {
    name: 'End and Home jump to the last and first enabled items',
    vue: vueMenu({ align: 'start' }),
    react: reactMenu({ align: 'start' }),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.keyboard('{End}')
      await focusOn('Export')
      await userEvent.keyboard('{Home}')
    },
    settle: async () => {
      await focusOn('Profile')
      await frames()
    },
  },
  {
    name: 'typeahead focuses the matching item',
    vue: vueMenu({ align: 'start' }),
    react: reactMenu({ align: 'start' }),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.keyboard('t')
    },
    settle: async () => {
      await focusOn('Tags')
      await frames()
    },
  },
  {
    name: 'ArrowRight opens the submenu and focuses its first item',
    vue: vueMenu({ align: 'start' }),
    react: reactMenu({ align: 'start' }),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.keyboard('{End}{ArrowRight}')
    },
    settle: async () => {
      await positioned(2)
      await focusOn('PDF')
      await frames()
    },
  },
  {
    name: 'ArrowLeft closes the submenu and returns focus to its trigger',
    vue: vueMenu({ align: 'start' }),
    react: reactMenu({ align: 'start' }),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.keyboard('{End}{ArrowRight}')
      await positioned(2)
      await focusOn('PDF')
      await userEvent.keyboard('{ArrowLeft}')
    },
    settle: async () => {
      await positioned(1)
      await focusOn('Export')
      await frames()
    },
  },
  {
    name: 'hovering a submenu trigger opens the submenu',
    vue: vueMenu({ align: 'start' }),
    react: reactMenu({ align: 'start' }),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.hover(item('Export'))
    },
    settle: async () => {
      await positioned(2)
      await frames()
    },
  },
  {
    name: 'pointer moves from the submenu trigger into the submenu',
    vue: vueMenu({ align: 'start' }),
    react: reactMenu({ align: 'start' }),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.hover(item('Export'))
      await positioned(2)
      await userEvent.hover(item('EPUB'))
    },
    settle: async () => {
      await focusOn('EPUB')
      await positioned(2)
    },
  },
  {
    name: 'moving onto a disabled item leaves the previous item focused',
    vue: vueMenu({ align: 'start' }),
    react: reactMenu({ align: 'start' }),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.hover(item('Tags'))
      await focusOn('Tags')
      await userEvent.hover(item('Locked'), { force: true })
    },
    settle: async () => {
      await focusOn('Tags')
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
                VDropdownMenu,
                { label: 'Show', align: 'start' },
                {
                  default: vueTrigger,
                  content: () =>
                    h(
                      VDropdownMenuCheckboxItem,
                      {
                        checked: checked.value,
                        'onUpdate:checked': (value: boolean) => (checked.value = value),
                      },
                      () => 'Cover',
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
          <DropdownMenu
            label="Show"
            align="start"
            content={
              <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
                Cover
              </DropdownMenuCheckboxItem>
            }
          >
            {reactTrigger()}
          </DropdownMenu>
        )
      }
      return <Harness />
    },
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.click(item('Cover'))
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (item('Cover').getAttribute('aria-checked') !== 'true') throw new Error('unchecked')
      })
      await positioned()
    },
  },
  {
    name: 'uncontrolled radio group selects another value and closes',
    vue: () =>
      h(
        VDropdownMenu,
        { label: 'Sort', align: 'start' },
        {
          default: vueTrigger,
          content: () =>
            h(VDropdownMenuRadioGroup, null, () => [
              h(VDropdownMenuRadioItem, { value: 'a' }, () => 'A'),
              h(VDropdownMenuRadioItem, { value: 'b' }, () => 'B'),
            ]),
        },
      ),
    react: () => (
      <DropdownMenu
        label="Sort"
        align="start"
        content={
          <DropdownMenuRadioGroup>
            <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="b">B</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        }
      >
        {reactTrigger()}
      </DropdownMenu>
    ),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.click(item('B'))
      await closed()
      await click(container)
    },
    settle: () => positioned(),
  },
  {
    name: 'selecting an item closes the menu and restores focus to the trigger',
    vue: vueMenu({ align: 'start' }, vueSimple),
    react: reactMenu({ align: 'start' }, reactSimple),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.click(item('Copy'))
    },
    settle: async () => {
      await closed()
      await vi.waitFor(() => {
        if (document.activeElement !== document.querySelector('#parity-host button'))
          throw new Error('focus not restored')
      })
    },
  },
  {
    name: 'Escape closes and restores focus to the trigger',
    vue: vueMenu({ align: 'start' }),
    react: reactMenu({ align: 'start' }),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.keyboard('{ArrowDown}{Escape}')
    },
    settle: async () => {
      await closed()
      await vi.waitFor(() => {
        if (document.activeElement !== document.querySelector('#parity-host button'))
          throw new Error('focus not restored')
      })
    },
  },
  {
    name: 'reopening after a close keeps the trigger wiring',
    vue: vueMenu({ align: 'start' }, vueSimple),
    react: reactMenu({ align: 'start' }, reactSimple),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.keyboard('{Escape}')
      await closed()
      await click(container)
    },
    settle: () => positioned(),
  },
  ...placement,
  {
    name: 'class, offset, direction and passthrough attributes reach the panel',
    vue: () =>
      h(
        VDropdownMenu,
        {
          open: true,
          dir: 'rtl',
          sideOffset: 16,
          class: 'w-64',
          'data-testid': 'panel',
          'aria-describedby': 'outside',
          style: 'color: red',
        },
        { default: vueTrigger, content: vueFull },
      ),
    react: () => (
      <DropdownMenu
        open
        dir="rtl"
        sideOffset={16}
        className="w-64"
        data-testid="panel"
        aria-describedby="outside"
        style={{ color: 'red' }}
        content={reactFull}
      >
        {reactTrigger()}
      </DropdownMenu>
    ),
    settle: () => positioned(),
  },
  {
    name: 'rtl submenu opens to the left',
    vue: () =>
      h(
        VDropdownMenu,
        { dir: 'rtl', align: 'start', label: 'Actions' },
        {
          default: () => h(VButton, { style: 'position:fixed;left:330px;top:120px' }, () => 'Open'),
          content: vueFull,
        },
      ),
    react: () => (
      <DropdownMenu dir="rtl" align="start" label="Actions" content={reactFull}>
        <Button style={{ position: 'fixed', left: 330, top: 120 }}>Open</Button>
      </DropdownMenu>
    ),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.keyboard('{End}{ArrowLeft}')
    },
    settle: async () => {
      await positioned(2)
      await focusOn('PDF')
    },
  },
  {
    name: 'modal external element anchor without a trigger',
    vue: () => h(VueElementAnchor),
    react: () => <ReactElementAnchor />,
    settle: () => positioned(),
  },
  {
    name: 'non-modal external element anchor without a trigger',
    vue: () => h(VueElementAnchor, { modal: false }),
    react: () => <ReactElementAnchor modal={false} />,
    settle: () => positioned(),
  },
  {
    name: 'virtual rectangle anchor',
    vue: () =>
      h(
        VDropdownMenu,
        { anchor: virtualRect, open: true, modal: false, label: 'Virtual' },
        { content: vueSimple },
      ),
    react: () => (
      <DropdownMenu anchor={virtualRect} open modal={false} label="Virtual" content={reactSimple} />
    ),
    settle: () => positioned(),
  },
  {
    name: 'virtual anchor with a context element',
    vue: () => h(VueContextAnchor),
    react: () => <ReactContextAnchor />,
    settle: () => positioned(),
  },
  {
    name: 'slotted trigger with an explicit anchor positions at the anchor',
    vue: () =>
      h(
        VDropdownMenu,
        { anchor: virtualRect, align: 'start' },
        { default: vueTrigger, content: vueSimple },
      ),
    react: () => (
      <DropdownMenu anchor={virtualRect} align="start" content={reactSimple}>
        {reactTrigger()}
      </DropdownMenu>
    ),
    interact: click,
    settle: () => positioned(),
  },
])
