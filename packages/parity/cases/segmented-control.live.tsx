import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VSegmentedControl from '@hina-ui/vue/components/segmented-control/SegmentedControl.vue'
import { SegmentedControl } from '@hina-ui/react/components/segmented-control/SegmentedControl'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  let last = ''
  let stable = 0
  await vi.waitFor(
    () => {
      const running = document.getAnimations().filter(a => a.playState === 'running')
      if (running.length || document.querySelector('[data-pressed]')) throw new Error('busy')
      const highlight = document.querySelector<HTMLElement>('[data-hn-highlight]')
      const key = highlight
        ? `${JSON.stringify(highlight.getBoundingClientRect())}|${highlight.style.transform}`
        : ''
      stable = key === last ? stable + 1 : 0
      last = key
      if (stable < 10) throw new Error('moving')
    },
    { timeout: 4000, interval: 16 },
  )
  await frames(4)
}

const options = [
  { value: 'all', label: '全部' },
  { value: 'ongoing', label: '连载中' },
  { value: 'done', label: '已完结', disabled: true },
]
const items = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('[data-hn-segmented-control] > button'))

export default defineLiveCases('SegmentedControl', [
  {
    name: 'mounted thumb sits in the first enabled option',
    vue: () => h(VSegmentedControl, { options, 'aria-label': '连载状态' }),
    react: () => <SegmentedControl options={options} aria-label="连载状态" />,
    settle: idle,
  },
  {
    name: 'clicking moves the thumb',
    vue: () => h(VSegmentedControl, { options, modelValue: 'all', 'aria-label': '连载状态' }),
    react: () => <SegmentedControl options={options} defaultValue="all" aria-label="连载状态" />,
    interact: async container => {
      await userEvent.click(items(container)[1]!)
    },
    settle: idle,
  },
  {
    name: 'clicking the selected option keeps it',
    vue: () => h(VSegmentedControl, { options, modelValue: 'ongoing', 'aria-label': '连载状态' }),
    react: () => (
      <SegmentedControl options={options} defaultValue="ongoing" aria-label="连载状态" />
    ),
    interact: async container => {
      await userEvent.click(items(container)[1]!)
    },
    settle: idle,
  },
  {
    name: 'arrows move focus and space selects',
    vue: () => h(VSegmentedControl, { options, modelValue: 'ongoing', 'aria-label': '连载状态' }),
    react: () => (
      <SegmentedControl options={options} defaultValue="ongoing" aria-label="连载状态" />
    ),
    interact: async () => {
      await userEvent.keyboard('{Tab}{ArrowLeft}')
      await userEvent.keyboard(' ')
      await userEvent.keyboard('{ArrowLeft}')
    },
    settle: idle,
  },
  {
    name: 'vertical block',
    vue: () =>
      h(VSegmentedControl, {
        options,
        modelValue: 'all',
        orientation: 'vertical',
        block: true,
        'aria-label': '连载状态',
      }),
    react: () => (
      <SegmentedControl
        options={options}
        defaultValue="all"
        orientation="vertical"
        block
        aria-label="连载状态"
      />
    ),
    interact: async container => {
      await userEvent.click(items(container)[1]!)
    },
    settle: idle,
  },
])
