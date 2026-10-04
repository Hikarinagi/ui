import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VDateRangePicker from '@hina-ui/vue/components/date-range-picker/DateRangePicker.vue'
import { DateRangePicker } from '@hina-ui/react/components/date-range-picker/DateRangePicker'
import { defineLiveCases, frames } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'

async function idle() {
  await vi.waitFor(
    () => {
      const running = document
        .getAnimations()
        .filter(a => a.playState === 'running' && !(a.timeline && 'source' in a.timeline))
      if (running.length) throw new Error('busy')
    },
    { timeout: 3000 },
  )
  await new Promise(resolve => setTimeout(resolve, 400))
  await frames(4)
}

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  await idle()
}

async function closed() {
  await vi.waitFor(() => {
    if (document.querySelector(wrapperSelector)) throw new Error('still open')
  })
  await idle()
}

const range = { start: '2026-09-04', end: '2026-09-10' }
const day = (date: string) =>
  document.querySelector<HTMLElement>(`[data-hn-range-calendar] [data-value="${date}"]`)!

async function open(container: HTMLElement) {
  await userEvent.click(container.querySelector<HTMLElement>('button[aria-label="打开日历"]')!)
  await vi.waitFor(() => {
    if (!document.querySelector('[data-hn-range-calendar]')) throw new Error('closed')
  })
}

export default defineLiveCases('DateRangePicker', [
  {
    name: 'opening shows the selected range',
    vue: () => h(VDateRangePicker, { modelValue: range, 'aria-label': '活动期间' }),
    react: () => <DateRangePicker defaultValue={range} aria-label="活动期间" />,
    interact: open,
    settle: positioned,
  },
  {
    name: 'picking a start keeps the calendar open with a hover preview',
    vue: () => h(VDateRangePicker, { modelValue: range, 'aria-label': '活动期间' }),
    react: () => <DateRangePicker defaultValue={range} aria-label="活动期间" />,
    interact: async container => {
      await open(container)
      await userEvent.click(day('2026-09-15'))
      await userEvent.hover(day('2026-09-19'))
    },
    settle: positioned,
  },
  {
    name: 'picking both ends writes back and closes',
    vue: () => h(VDateRangePicker, { modelValue: range, 'aria-label': '活动期间' }),
    react: () => <DateRangePicker defaultValue={range} aria-label="活动期间" />,
    interact: async container => {
      await open(container)
      await userEvent.click(day('2026-09-15'))
      await userEvent.click(day('2026-09-19'))
    },
    settle: closed,
  },
  {
    name: 'maximum days disables far days after the start',
    vue: () =>
      h(VDateRangePicker, { placeholder: '2026-09-01', maximumDays: 5, 'aria-label': '活动期间' }),
    react: () => <DateRangePicker placeholder="2026-09-01" maximumDays={5} aria-label="活动期间" />,
    interact: async container => {
      await open(container)
      await userEvent.click(day('2026-09-10'))
    },
    settle: positioned,
  },
])
