import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VRangeCalendar from '@hina-ui/vue/components/range-calendar/RangeCalendar.vue'
import { RangeCalendar } from '@hina-ui/react/components/range-calendar/RangeCalendar'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  await vi.waitFor(
    () => {
      const running = document
        .getAnimations()
        .filter(a => a.playState === 'running' && !(a.timeline && 'source' in a.timeline))
      if (running.length || document.querySelector('[data-pressed]')) throw new Error('busy')
    },
    { timeout: 3000 },
  )
  await new Promise(resolve => setTimeout(resolve, 400))
  await frames(4)
}

function level(name: string) {
  return async () => {
    await vi.waitFor(() => {
      const root = document.querySelector('[data-hn-range-calendar]')
      if (root?.getAttribute('data-level') !== name) throw new Error('level')
      const picker =
        name === 'day'
          ? '[data-radix-calendar-cell-trigger],[data-reka-calendar-cell-trigger]'
          : `[data-radix-${name}-picker-cell-trigger],[data-reka-${name}-picker-cell-trigger]`
      if (!root.querySelector(picker)) throw new Error('not entered')
    })
    await idle()
  }
}

const cell = (container: HTMLElement, date: string) =>
  container.querySelector<HTMLElement>(`[data-value="${date}"]`)!

const range = { start: '2026-09-04', end: '2026-09-10' }

export default defineLiveCases('RangeCalendar', [
  {
    name: 'idle markup',
    vue: () => h(VRangeCalendar, { modelValue: range }),
    react: () => <RangeCalendar defaultValue={range} />,
    settle: idle,
  },
  {
    name: 'start then hover previews the band',
    vue: () => h(VRangeCalendar, { placeholder: '2026-09-01' }),
    react: () => <RangeCalendar defaultPlaceholder="2026-09-01" />,
    interact: async container => {
      await userEvent.click(cell(container, '2026-09-04'))
      await userEvent.hover(cell(container, '2026-09-08'))
    },
    settle: idle,
  },
  {
    name: 'two clicks complete a range',
    vue: () => h(VRangeCalendar, { placeholder: '2026-09-01' }),
    react: () => <RangeCalendar defaultPlaceholder="2026-09-01" />,
    interact: async container => {
      await userEvent.click(cell(container, '2026-09-14'))
      await userEvent.click(cell(container, '2026-09-03'))
      await userEvent.unhover(cell(container, '2026-09-03'))
    },
    settle: idle,
  },
  {
    name: 'keyboard selects a range across months',
    vue: () => h(VRangeCalendar, { placeholder: '2026-09-28' }),
    react: () => <RangeCalendar defaultPlaceholder="2026-09-28" />,
    interact: async container => {
      cell(container, '2026-09-28').focus()
      await userEvent.keyboard('{Enter}{ArrowDown}')
      await vi.waitFor(() => {
        if (document.activeElement?.getAttribute('data-value') !== '2026-10-05')
          throw new Error('focus')
      })
      await userEvent.keyboard('{Enter}')
    },
    settle: idle,
  },
  {
    name: 'maximum days disable far dates while picking',
    vue: () => h(VRangeCalendar, { placeholder: '2026-09-01', maximumDays: 5 }),
    react: () => <RangeCalendar defaultPlaceholder="2026-09-01" maximumDays={5} />,
    interact: async container => {
      await userEvent.click(cell(container, '2026-09-10'))
      await userEvent.hover(cell(container, '2026-09-12'))
    },
    settle: idle,
  },
  {
    name: 'Escape while editing restores the last complete range',
    vue: () => h(VRangeCalendar, { modelValue: range }),
    react: () => <RangeCalendar defaultValue={range} />,
    interact: async container => {
      await userEvent.click(cell(container, '2026-09-20'))
      await userEvent.keyboard('{Escape}')
      await userEvent.unhover(cell(container, '2026-09-20'))
    },
    settle: idle,
  },
  {
    name: 'heading opens the month level',
    vue: () => h(VRangeCalendar, { modelValue: range }),
    react: () => <RangeCalendar defaultValue={range} />,
    interact: async container => {
      await userEvent.click(container.querySelector<HTMLElement>('button[aria-label="选择月份"]')!)
    },
    settle: level('month'),
  },
  {
    name: 'picking another month keeps the range',
    vue: () => h(VRangeCalendar, { modelValue: range }),
    react: () => <RangeCalendar defaultValue={range} />,
    interact: async container => {
      await userEvent.click(container.querySelector<HTMLElement>('button[aria-label="选择月份"]')!)
      await level('month')()
      await userEvent.keyboard('{ArrowRight}{Enter}')
    },
    settle: level('day'),
  },
])
