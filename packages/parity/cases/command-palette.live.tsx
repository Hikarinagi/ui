import { h } from 'vue'
import type { ReactElement } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VCommandPalette from '@hina-ui/vue/components/command-palette/CommandPalette.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { CommandPalette } from '@hina-ui/react/components/command-palette/CommandPalette'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const items = [
  {
    label: '页面',
    items: [
      { id: 'home', label: '首页', keywords: ['home'] },
      { id: 'settings', label: '设置', description: '账号与偏好', kbd: ['⌘', ','] },
      { id: 'off', label: '停用', disabled: true },
    ],
  },
  { id: 'theme', label: '切换主题' },
]
const many = Array.from({ length: 10000 }, (_, value) => ({
  id: String(value),
  label: `Item ${String(value).padStart(5, '0')}`,
  keywords: [`keyword-${value}`],
}))

async function settled() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-hn-command-palette]')) throw new Error('not mounted')
    if (!document.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('no viewport')
  })
  const panel = document.querySelector<HTMLElement>('[data-hn-command-palette]')!
  await Promise.allSettled(panel.getAnimations().map(animation => animation.finished))
  await frames(8)
}

async function dialogClosed() {
  await vi.waitFor(() => {
    if (document.querySelector('[role="dialog"]')) throw new Error('still open')
  })
  await frames(6)
}

async function mounted() {
  await frames(6)
}

const input = () => document.querySelector<HTMLInputElement>('[data-hn-command-palette] input')!

const cases: LiveCase[] = [
  {
    name: 'trigger after mount',
    vue: () =>
      h(VCommandPalette, { items, hotkey: 'mod+k' }, () =>
        h(VButton, { variant: 'outline', tone: 'neutral' }, () => '搜索'),
      ),
    react: () => (
      <CommandPalette items={items} hotkey="mod+k">
        <Button variant="outline" tone="neutral">
          搜索
        </Button>
      </CommandPalette>
    ),
    settle: mounted,
  },
  {
    name: 'dialog opened by the trigger',
    vue: () =>
      h(VCommandPalette, { items }, () =>
        h(VButton, { variant: 'outline', tone: 'neutral' }, () => '搜索'),
      ),
    react: () => (
      <CommandPalette items={items}>
        <Button variant="outline" tone="neutral">
          搜索
        </Button>
      </CommandPalette>
    ),
    interact: async container => {
      await userEvent.click(container.querySelector('button')!)
      await settled()
      await vi.waitFor(() => {
        if (document.activeElement !== input()) throw new Error('not focused')
      })
    },
    settle: settled,
  },
  {
    name: 'dialog search and arrow navigation',
    vue: () => h(VCommandPalette, { items, open: true, label: 'Commands' }),
    react: () => <CommandPalette items={items} open label="Commands" />,
    interact: async () => {
      await settled()
      await vi.waitFor(() => {
        if (document.activeElement !== input()) throw new Error('not focused')
      })
      await userEvent.keyboard('设')
      await frames(4)
      await userEvent.keyboard('{Backspace}{ArrowDown}')
    },
    settle: settled,
  },
  {
    name: 'dialog closed by Escape',
    vue: () =>
      h(VCommandPalette, { items }, () =>
        h(VButton, { variant: 'outline', tone: 'neutral' }, () => '搜索'),
      ),
    react: () => (
      <CommandPalette items={items}>
        <Button variant="outline" tone="neutral">
          搜索
        </Button>
      </CommandPalette>
    ),
    interact: async container => {
      await userEvent.click(container.querySelector('button')!)
      await settled()
      await userEvent.keyboard('{Escape}')
      await dialogClosed()
    },
    settle: mounted,
  },
  {
    name: 'inline hover and empty state',
    vue: () => h(VCommandPalette, { items, inline: true }),
    react: () => <CommandPalette items={items} inline />,
    interact: async () => {
      await settled()
      await userEvent.hover(document.querySelectorAll<HTMLElement>('[role="option"]')[3]!)
      await userEvent.click(input())
      await userEvent.keyboard('不存在')
    },
    settle: settled,
  },
  {
    name: 'inline highlight after typing',
    vue: () => h(VCommandPalette, { items, inline: true }),
    react: () => <CommandPalette items={items} inline />,
    interact: async () => {
      await settled()
      await userEvent.click(input())
      await userEvent.keyboard('主题{ArrowDown}')
    },
    settle: settled,
  },
  {
    name: 'inline virtualized keyword search',
    vue: () =>
      h(VCommandPalette, { items: many, inline: true, virtualize: true, label: 'Commands' }),
    react: () => <CommandPalette items={many} inline virtualize label="Commands" />,
    interact: async () => {
      await settled()
      await userEvent.click(input())
      await userEvent.keyboard('{End}')
      await frames(6)
      await userEvent.keyboard('keyword-7890')
    },
    settle: settled,
  },
]

export default defineLiveCases('CommandPalette', cases)
