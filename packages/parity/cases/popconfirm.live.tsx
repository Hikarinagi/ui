import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VPopconfirm from '@hina-ui/vue/components/popconfirm/Popconfirm.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Popconfirm } from '@hina-ui/react/components/popconfirm/Popconfirm'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  const panel = document.querySelector<HTMLElement>('[data-hn-popconfirm]')!
  await Promise.allSettled(panel.getAnimations().map(animation => animation.finished))
  await frames()
}

async function closed() {
  await vi.waitFor(() => {
    if (document.querySelector(wrapperSelector)) throw new Error('still open')
  })
  await frames()
}

function focusOn(selector: string) {
  const target = document.querySelector(selector)
  if (!target || document.activeElement !== target)
    throw new Error(`focus is not on ${selector}: ${document.activeElement?.outerHTML}`)
}

function focusOnText(text: string) {
  if (document.activeElement?.textContent?.trim() !== text)
    throw new Error(`focus is not on ${text}: ${document.activeElement?.outerHTML}`)
}

const triggerStyle = 'position:fixed;left:360px;top:240px'
const vueTrigger = () =>
  h(VButton, { variant: 'outline', tone: 'neutral', style: triggerStyle }, () => 'Delete')
const reactTrigger = () => (
  <Button variant="outline" tone="neutral" style={{ position: 'fixed', left: 360, top: 240 }}>
    Delete
  </Button>
)

const base = { title: 'Delete this comment?', description: 'This cannot be undone.' }

function vueConfirm(props: Record<string, unknown> = {}) {
  return () => h(VPopconfirm, { ...base, ...props }, vueTrigger)
}

const click = async (container: HTMLElement) => {
  await userEvent.click(container.querySelector('button')!)
}

const sides = ['top', 'right', 'bottom', 'left'] as const
const aligns = ['start', 'center', 'end'] as const

const placement: LiveCase[] = sides.flatMap(side =>
  aligns.map(align => ({
    name: `controlled open on ${side} ${align}`,
    vue: vueConfirm({ open: true, side, align }),
    react: () => (
      <Popconfirm {...base} open side={side} align={align}>
        {reactTrigger()}
      </Popconfirm>
    ),
    settle: positioned,
  })),
)

const pending = () => new Promise<void>(() => {})

export default defineLiveCases('Popconfirm', [
  {
    name: 'closed by default',
    vue: vueConfirm(),
    react: () => <Popconfirm {...base}>{reactTrigger()}</Popconfirm>,
    settle: closed,
  },
  {
    name: 'opens on click with focus on cancel',
    vue: vueConfirm(),
    react: () => <Popconfirm {...base}>{reactTrigger()}</Popconfirm>,
    interact: click,
    settle: async () => {
      await positioned()
      focusOnText('取消')
    },
  },
  ...placement,
  {
    name: 'danger tone, custom texts, content slot and class without description',
    vue: () =>
      h(
        VPopconfirm,
        {
          title: 'Delete?',
          tone: 'danger',
          confirmText: 'Delete',
          cancelText: 'Keep',
          sideOffset: 4,
          class: 'w-80',
          open: true,
        },
        { default: vueTrigger, content: () => h('p', 'Extra detail') },
      ),
    react: () => (
      <Popconfirm
        title="Delete?"
        tone="danger"
        confirmText="Delete"
        cancelText="Keep"
        sideOffset={4}
        className="w-80"
        open
        content={<p>Extra detail</p>}
      >
        {reactTrigger()}
      </Popconfirm>
    ),
    settle: positioned,
  },
  {
    name: 'busy while an asynchronous confirmation is pending',
    vue: vueConfirm({ onConfirm: pending }),
    react: () => (
      <Popconfirm {...base} onConfirm={pending}>
        {reactTrigger()}
      </Popconfirm>
    ),
    interact: async container => {
      await click(container)
      await positioned()
      const confirm = [
        ...document.querySelectorAll<HTMLElement>('[data-hn-popconfirm] button'),
      ].find(button => button.textContent?.trim() === '确定')!
      await userEvent.click(confirm)
      await userEvent.keyboard('{Escape}')
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (document.querySelector('[data-hn-popconfirm]')?.getAttribute('aria-busy') !== 'true')
          throw new Error('not busy')
        if (document.querySelector('[class*="v-enter"]')) throw new Error('entering')
      })
      await new Promise(resolve => setTimeout(resolve, 600))
      await frames()
    },
  },
  {
    name: 'Escape closes and restores focus to the trigger',
    vue: vueConfirm(),
    react: () => <Popconfirm {...base}>{reactTrigger()}</Popconfirm>,
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
    name: 'outside click closes and restores focus to the trigger',
    vue: vueConfirm(),
    react: () => <Popconfirm {...base}>{reactTrigger()}</Popconfirm>,
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
    name: 'cancel closes and restores focus to the trigger',
    vue: vueConfirm(),
    react: () => <Popconfirm {...base}>{reactTrigger()}</Popconfirm>,
    interact: async container => {
      await click(container)
      await positioned()
      await userEvent.keyboard('{Enter}')
    },
    settle: async () => {
      await closed()
      focusOn('#parity-host button')
    },
  },
])
