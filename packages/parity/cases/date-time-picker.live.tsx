import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VDateTimePicker from '@hina-ui/vue/components/date-time-picker/DateTimePicker.vue'
import { DateTimePicker } from '@hina-ui/react/components/date-time-picker/DateTimePicker'
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

const day = (date: string) =>
  document.querySelector<HTMLElement>(`[data-hn-calendar] [data-value="${date}"]`)!
const timeSpins = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      '[role="dialog"] [data-hn-time-field] [role="spinbutton"]',
    ),
  )

async function open(container: HTMLElement) {
  await userEvent.click(container.querySelector<HTMLElement>('button[aria-label="打开日历"]')!)
  await vi.waitFor(() => {
    if (!document.querySelector('[data-hn-calendar]')) throw new Error('closed')
  })
}

export default defineLiveCases('DateTimePicker', [
  {
    name: 'opening shows the calendar and the time footer',
    vue: () => h(VDateTimePicker, { modelValue: '2026-09-04T20:30', 'aria-label': '发布时间' }),
    react: () => <DateTimePicker defaultValue="2026-09-04T20:30" aria-label="发布时间" />,
    interact: open,
    settle: positioned,
  },
  {
    name: 'picking a day keeps the time and stays open',
    vue: () => h(VDateTimePicker, { modelValue: '2026-09-04T20:30', 'aria-label': '发布时间' }),
    react: () => <DateTimePicker defaultValue="2026-09-04T20:30" aria-label="发布时间" />,
    interact: async container => {
      await open(container)
      await userEvent.click(day('2026-09-10'))
    },
    settle: positioned,
  },
  {
    name: 'typing in the time footer writes back',
    vue: () => h(VDateTimePicker, { modelValue: '2026-09-04T20:30', 'aria-label': '发布时间' }),
    react: () => <DateTimePicker defaultValue="2026-09-04T20:30" aria-label="发布时间" />,
    interact: async container => {
      await open(container)
      await userEvent.click(timeSpins()[0]!)
      await userEvent.keyboard('0915')
    },
    settle: positioned,
  },
  {
    name: 'empty value takes the placeholder time',
    vue: () =>
      h(VDateTimePicker, {
        placeholder: '2026-09-01T09:00',
        granularity: 'second',
        'aria-label': '发布时间',
      }),
    react: () => (
      <DateTimePicker placeholder="2026-09-01T09:00" granularity="second" aria-label="发布时间" />
    ),
    interact: async container => {
      await open(container)
      await userEvent.click(day('2026-09-10'))
    },
    settle: positioned,
  },
  {
    name: 'confirm closes the popup',
    vue: () => h(VDateTimePicker, { modelValue: '2026-09-04T20:30', 'aria-label': '发布时间' }),
    react: () => <DateTimePicker defaultValue="2026-09-04T20:30" aria-label="发布时间" />,
    interact: async container => {
      await open(container)
      const done = Array.from(
        document.querySelectorAll<HTMLElement>('[role="dialog"] button'),
      ).find(b => b.textContent?.trim() === '确定')!
      await userEvent.click(done)
    },
    settle: closed,
  },
])
