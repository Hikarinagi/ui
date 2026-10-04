import { defineComponent, h, shallowRef } from 'vue'
import { useState } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VPopover from '@hina-ui/vue/components/popover/Popover.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import VIconButton from '@hina-ui/vue/components/icon-button/IconButton.vue'
import { Popover } from '@hina-ui/react/components/popover/Popover'
import { Button } from '@hina-ui/react/components/button/Button'
import { IconButton } from '@hina-ui/react/components/icon-button/IconButton'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  const panel = document.querySelector<HTMLElement>('[role="dialog"]')!
  await Promise.allSettled(panel.getAnimations().map(animation => animation.finished))
  await frames()
}

async function closed() {
  await vi.waitFor(() => {
    if (document.querySelector(wrapperSelector)) throw new Error('still open')
  })
  await frames()
}

function focusInPanel() {
  const panel = document.querySelector('[role="dialog"]')
  if (!panel?.contains(document.activeElement)) throw new Error('focus is not in the panel')
}

function focusOn(selector: string) {
  const target = document.querySelector(selector)
  if (!target || document.activeElement !== target)
    throw new Error(`focus is not on ${selector}: ${document.activeElement?.outerHTML}`)
}

const triggerStyle = 'position:fixed;left:360px;top:240px'
const anchorStyle = 'position:fixed;left:200px;top:180px;width:80px;height:30px'

const vueTrigger = () =>
  h(VButton, { variant: 'outline', tone: 'neutral', style: triggerStyle }, () => 'Open')
const reactTrigger = () => (
  <Button variant="outline" tone="neutral" style={{ position: 'fixed', left: 360, top: 240 }}>
    Open
  </Button>
)

const vueContent = () => [h('p', 'Panel'), h('button', { type: 'button' }, 'Action')]
const reactContent = (
  <>
    <p>Panel</p>
    <button type="button">Action</button>
  </>
)

function vuePopover(props: Record<string, unknown> = {}) {
  return () => h(VPopover, props, { default: vueTrigger, content: vueContent })
}

const click = async (container: HTMLElement) => {
  await userEvent.click(container.querySelector('button')!)
}

const sides = ['top', 'right', 'bottom', 'left'] as const
const aligns = ['start', 'center', 'end'] as const

const placement: LiveCase[] = sides.flatMap(side =>
  aligns.map(align => ({
    name: `controlled open on ${side} ${align}`,
    vue: vuePopover({ open: true, side, align }),
    react: () => (
      <Popover open side={side} align={align} content={reactContent}>
        {reactTrigger()}
      </Popover>
    ),
    settle: positioned,
  })),
)

const virtualRect = {
  getBoundingClientRect: () => new DOMRect(420, 300, 2, 20),
}

const VueElementAnchor = defineComponent({
  props: { modal: { type: Boolean, default: true } },
  setup(props) {
    const anchor = shallowRef<HTMLElement | null>(null)
    return () => [
      h('button', { ref: anchor, type: 'button', style: anchorStyle }, 'Anchor'),
      h(
        VPopover,
        {
          anchor: anchor.value,
          open: true,
          modal: props.modal,
          align: 'start',
          'aria-label': 'External',
        },
        { content: vueContent },
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
        style={{ position: 'fixed', left: 200, top: 180, width: 80, height: 30 }}
      >
        Anchor
      </button>
      <Popover
        anchor={anchor}
        open
        modal={modal}
        align="start"
        aria-label="External"
        content={reactContent}
      />
    </>
  )
}

const VueContextAnchor = defineComponent({
  setup() {
    const host = shallowRef<HTMLElement | null>(null)
    return () => [
      h('div', {
        ref: host,
        style: 'position:fixed;left:100px;top:100px;width:300px;height:200px',
      }),
      h(
        VPopover,
        {
          anchor: host.value
            ? {
                getBoundingClientRect: () => new DOMRect(150, 160, 2, 20),
                contextElement: host.value,
              }
            : null,
          open: true,
          modal: false,
          side: 'right',
          'aria-label': 'Context',
        },
        { content: vueContent },
      ),
    ]
  },
})

function ReactContextAnchor() {
  const [host, setHost] = useState<HTMLElement | null>(null)
  const [anchor] = useState(() => ({ current: null as null | object }))
  if (host && !anchor.current)
    anchor.current = {
      getBoundingClientRect: () => new DOMRect(150, 160, 2, 20),
      contextElement: host,
    }
  return (
    <>
      <div
        ref={setHost}
        style={{ position: 'fixed', left: 100, top: 100, width: 300, height: 200 }}
      />
      <Popover
        anchor={anchor.current as never}
        open
        modal={false}
        side="right"
        aria-label="Context"
        content={reactContent}
      />
    </>
  )
}

export default defineLiveCases('Popover', [
  {
    name: 'closed by default',
    vue: vuePopover(),
    react: () => <Popover content={reactContent}>{reactTrigger()}</Popover>,
    settle: closed,
  },
  {
    name: 'modal opens on click and moves focus into the panel',
    vue: vuePopover(),
    react: () => <Popover content={reactContent}>{reactTrigger()}</Popover>,
    interact: click,
    settle: async () => {
      await positioned()
      focusInPanel()
    },
  },
  {
    name: 'non-modal opens on click without locking the page',
    vue: vuePopover({ modal: false }),
    react: () => (
      <Popover modal={false} content={reactContent}>
        {reactTrigger()}
      </Popover>
    ),
    interact: click,
    settle: async () => {
      await positioned()
      focusInPanel()
    },
  },
  ...placement,
  {
    name: 'unpadded with class, offset and passthrough attributes',
    vue: vuePopover({
      open: true,
      padded: false,
      sideOffset: 16,
      class: 'w-64',
      'aria-label': 'Details',
      'aria-describedby': 'outside-description',
      'data-testid': 'panel',
      style: 'color: red',
    }),
    react: () => (
      <Popover
        open
        padded={false}
        sideOffset={16}
        className="w-64"
        aria-label="Details"
        aria-describedby="outside-description"
        data-testid="panel"
        style={{ color: 'red' }}
        content={reactContent}
      >
        {reactTrigger()}
      </Popover>
    ),
    settle: positioned,
  },
  {
    name: 'modal external element anchor without a trigger',
    vue: () => h(VueElementAnchor),
    react: () => <ReactElementAnchor />,
    settle: positioned,
  },
  {
    name: 'non-modal external element anchor without a trigger',
    vue: () => h(VueElementAnchor, { modal: false }),
    react: () => <ReactElementAnchor modal={false} />,
    settle: positioned,
  },
  {
    name: 'virtual rectangle anchor',
    vue: () =>
      h(
        VPopover,
        { anchor: virtualRect, open: true, modal: false, 'aria-label': 'Virtual' },
        { content: vueContent },
      ),
    react: () => (
      <Popover
        anchor={virtualRect}
        open
        modal={false}
        aria-label="Virtual"
        content={reactContent}
      />
    ),
    settle: positioned,
  },
  {
    name: 'virtual anchor with a context element',
    vue: () => h(VueContextAnchor),
    react: () => <ReactContextAnchor />,
    settle: positioned,
  },
  {
    name: 'slotted trigger with an explicit anchor positions at the anchor',
    vue: () =>
      h(
        VPopover,
        { anchor: virtualRect, align: 'start' },
        { default: vueTrigger, content: vueContent },
      ),
    react: () => (
      <Popover anchor={virtualRect} align="start" content={reactContent}>
        {reactTrigger()}
      </Popover>
    ),
    interact: click,
    settle: positioned,
  },
  {
    name: 'keyboard opens from the focused trigger',
    vue: vuePopover(),
    react: () => <Popover content={reactContent}>{reactTrigger()}</Popover>,
    interact: async () => {
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
    },
    settle: async () => {
      await positioned()
      focusInPanel()
    },
  },
  {
    name: 'Escape closes and restores focus to the trigger',
    vue: vuePopover(),
    react: () => <Popover content={reactContent}>{reactTrigger()}</Popover>,
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.keyboard('{Escape}')
    },
    settle: async () => {
      await closed()
      focusOn('#parity-host button')
    },
  },
  {
    name: 'non-modal Escape closes and restores focus to the trigger',
    vue: vuePopover({ modal: false }),
    react: () => (
      <Popover modal={false} content={reactContent}>
        {reactTrigger()}
      </Popover>
    ),
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.keyboard('{Escape}')
    },
    settle: async () => {
      await closed()
      focusOn('#parity-host button')
    },
  },
  {
    name: 'modal outside click closes and restores focus to the trigger',
    vue: vuePopover(),
    react: () => <Popover content={reactContent}>{reactTrigger()}</Popover>,
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.click(document.body, { force: true, position: { x: 8, y: 8 } })
    },
    settle: async () => {
      await closed()
      focusOn('#parity-host button')
    },
  },
  {
    name: 'non-modal outside click closes without restoring focus',
    vue: () =>
      h('div', [
        h(
          'button',
          { type: 'button', 'data-outside': '', style: 'position:fixed;left:8px;top:8px' },
          'Outside',
        ),
        h(VPopover, { modal: false }, { default: vueTrigger, content: vueContent }),
      ]),
    react: () => (
      <div>
        <button type="button" data-outside="" style={{ position: 'fixed', left: 8, top: 8 }}>
          Outside
        </button>
        <Popover modal={false} content={reactContent}>
          {reactTrigger()}
        </Popover>
      </div>
    ),
    interact: async container => {
      await userEvent.click(container.querySelectorAll('button')[1]!)
      await positioned()
      await userEvent.click(container.querySelector('[data-outside]')!)
    },
    settle: async () => {
      await closed()
      focusOn('[data-outside]')
    },
  },
  {
    name: 'IconButton trigger without its tooltip',
    vue: () =>
      h(
        VPopover,
        { align: 'end' },
        {
          default: () =>
            h(VIconButton, { label: 'Theme', tooltip: false, style: triggerStyle }, () => h('svg')),
          content: vueContent,
        },
      ),
    react: () => (
      <Popover align="end" content={reactContent}>
        <IconButton
          label="Theme"
          tooltip={false}
          style={{ position: 'fixed', left: 360, top: 240 }}
        >
          <svg />
        </IconButton>
      </Popover>
    ),
    interact: click,
    settle: positioned,
  },
])
