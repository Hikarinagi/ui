import { defineComponent, h, shallowRef } from 'vue'
import { useState } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VHoverCard from '@hina-ui/vue/components/hover-card/HoverCard.vue'
import VLink from '@hina-ui/vue/components/link/Link.vue'
import { HoverCard } from '@hina-ui/react/components/hover-card/HoverCard'
import { Link } from '@hina-ui/react/components/link/Link'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  const card = document.querySelector<HTMLElement>('[data-hn-hover-card]')
  if (card) await Promise.allSettled(card.getAnimations().map(animation => animation.finished))
  await frames()
}

async function closed() {
  await vi.waitFor(() => {
    if (document.querySelector(wrapperSelector)) throw new Error('still open')
  })
  await frames()
}

async function park() {
  const spot = document.createElement('div')
  spot.style.cssText = 'position:fixed;left:0;top:0;width:4px;height:4px'
  document.body.appendChild(spot)
  await userEvent.hover(spot)
  spot.remove()
}

const triggerStyle = 'position:fixed;left:360px;top:240px'
const vueTrigger = () => h('a', { href: '#', style: triggerStyle }, '@shion')
const reactTrigger = () => (
  <a href="#" style={{ position: 'fixed', left: 360, top: 240 }}>
    @shion
  </a>
)
const vueContent = () => [h('p', 'Profile'), h('a', { href: '#profile' }, 'More')]
const reactContent = (
  <>
    <p>Profile</p>
    <a href="#profile">More</a>
  </>
)

function vueCard(props: Record<string, unknown> = {}) {
  return () => h(VHoverCard, props, { default: vueTrigger, content: vueContent })
}

const sides = ['top', 'right', 'bottom', 'left'] as const
const aligns = ['start', 'center', 'end'] as const

const placement: LiveCase[] = sides.flatMap(side =>
  aligns.map(align => ({
    name: `controlled open on ${side} ${align}`,
    vue: vueCard({ open: true, side, align }),
    react: () => (
      <HoverCard open side={side} align={align} content={reactContent}>
        {reactTrigger()}
      </HoverCard>
    ),
    settle: positioned,
  })),
)

const virtualRect = { getBoundingClientRect: () => new DOMRect(420, 300, 2, 20) }
const anchorStyle = 'position:fixed;left:200px;top:180px;width:80px;height:30px'

const VueElementAnchor = defineComponent({
  setup() {
    const anchor = shallowRef<HTMLElement | null>(null)
    const open = shallowRef(false)
    const show = (event: Event) => {
      anchor.value = event.currentTarget as HTMLElement
      open.value = true
    }
    return () => [
      h('button', { type: 'button', style: anchorStyle, onFocus: show }, 'Anchor'),
      h(
        VHoverCard,
        {
          anchor: anchor.value,
          open: open.value,
          'onUpdate:open': (value: boolean | undefined) => {
            open.value = !!value
          },
          align: 'start',
          positionerClass: 'positioner-only',
        },
        { content: vueContent },
      ),
    ]
  },
})

function ReactElementAnchor() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        style={{ position: 'fixed', left: 200, top: 180, width: 80, height: 30 }}
        onFocus={event => {
          setAnchor(event.currentTarget)
          setOpen(true)
        }}
      >
        Anchor
      </button>
      <HoverCard
        anchor={anchor}
        open={open}
        onOpenChange={setOpen}
        align="start"
        positionerClass="positioner-only"
        content={reactContent}
      />
    </>
  )
}

export default defineLiveCases('HoverCard', [
  {
    name: 'closed by default',
    vue: vueCard(),
    react: () => <HoverCard content={reactContent}>{reactTrigger()}</HoverCard>,
    settle: closed,
  },
  ...placement,
  {
    name: 'unpadded with class, offset and positioner class',
    vue: () =>
      h(
        VHoverCard,
        {
          open: true,
          padded: false,
          sideOffset: 16,
          class: 'w-64',
          positionerClass: 'positioner-only',
        },
        {
          default: () => h(VLink, { href: '#', style: triggerStyle }, () => 'Reka UI'),
          content: vueContent,
        },
      ),
    react: () => (
      <HoverCard
        open
        padded={false}
        sideOffset={16}
        className="w-64"
        positionerClass="positioner-only"
        content={reactContent}
      >
        <Link href="#" style={{ position: 'fixed', left: 360, top: 240 }}>
          Reka UI
        </Link>
      </HoverCard>
    ),
    settle: positioned,
  },
  {
    name: 'hover opens after the delay',
    vue: vueCard({ openDelay: 50 }),
    react: () => (
      <HoverCard openDelay={50} content={reactContent}>
        {reactTrigger()}
      </HoverCard>
    ),
    interact: async container => {
      await park()
      await userEvent.hover(container.querySelector('a')!)
    },
    settle: positioned,
  },
  {
    name: 'keyboard focus opens without moving focus',
    vue: vueCard({ openDelay: 50 }),
    react: () => (
      <HoverCard openDelay={50} content={reactContent}>
        {reactTrigger()}
      </HoverCard>
    ),
    interact: async () => {
      await userEvent.tab()
    },
    settle: async () => {
      await positioned()
      if (document.activeElement !== document.querySelector('#parity-host a'))
        throw new Error('focus left the trigger')
    },
  },
  {
    name: 'pointer leaving closes after the delay',
    vue: vueCard({ openDelay: 50, closeDelay: 50 }),
    react: () => (
      <HoverCard openDelay={50} closeDelay={50} content={reactContent}>
        {reactTrigger()}
      </HoverCard>
    ),
    interact: async container => {
      await park()
      await userEvent.hover(container.querySelector('a')!)
      await positioned()
      await park()
    },
    settle: closed,
  },
  {
    name: 'Escape closes',
    vue: vueCard({ openDelay: 50 }),
    react: () => (
      <HoverCard openDelay={50} content={reactContent}>
        {reactTrigger()}
      </HoverCard>
    ),
    interact: async container => {
      await park()
      await userEvent.hover(container.querySelector('a')!)
      await positioned()
      await userEvent.keyboard('{Escape}')
    },
    settle: closed,
  },
  {
    name: 'external element anchor opened by keyboard focus',
    vue: () => h(VueElementAnchor),
    react: () => <ReactElementAnchor />,
    interact: async () => {
      await userEvent.tab()
    },
    settle: positioned,
  },
  {
    name: 'external element anchor closes when focus leaves',
    vue: () => h(VueElementAnchor),
    react: () => <ReactElementAnchor />,
    interact: async () => {
      await userEvent.tab()
      await positioned()
      await userEvent.tab()
    },
    settle: closed,
  },
  {
    name: 'virtual rectangle anchor',
    vue: () => h(VHoverCard, { anchor: virtualRect, open: true }, { content: vueContent }),
    react: () => <HoverCard anchor={virtualRect} open content={reactContent} />,
    settle: positioned,
  },
])
