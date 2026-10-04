import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VDatePicker from '@hina-ui/vue/components/date-picker/DatePicker.vue'
import { DatePicker } from '@hina-ui/react/components/date-picker/DatePicker'
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

const toggle = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('button[aria-label="打开日历"]')!

async function open(container: HTMLElement) {
  await userEvent.click(toggle(container))
  await vi.waitFor(() => {
    if (!document.querySelector('[data-hn-calendar]')) throw new Error('closed')
  })
}

export default defineLiveCases('DatePicker', [
  {
    name: 'opening shows the calendar with the selection focused',
    vue: () => h(VDatePicker, { modelValue: '2026-09-04', 'aria-label': '发布日期' }),
    react: () => <DatePicker defaultValue="2026-09-04" aria-label="发布日期" />,
    interact: open,
    settle: positioned,
  },
  {
    name: 'opening an empty picker uses the placeholder month',
    vue: () => h(VDatePicker, { placeholder: '2026-09-01', 'aria-label': '发布日期' }),
    react: () => <DatePicker placeholder="2026-09-01" aria-label="发布日期" />,
    interact: open,
    settle: positioned,
  },
  {
    name: 'keyboard moves within the open calendar',
    vue: () => h(VDatePicker, { modelValue: '2026-09-04', 'aria-label': '发布日期' }),
    react: () => <DatePicker defaultValue="2026-09-04" aria-label="发布日期" />,
    interact: async container => {
      await open(container)
      await vi.waitFor(() => {
        if (!document.activeElement?.hasAttribute('data-value')) throw new Error('not focused')
      })
      await userEvent.keyboard('{ArrowDown}{ArrowRight}')
    },
    settle: positioned,
  },
  {
    name: 'picking a day writes back and closes',
    vue: () =>
      h(VDatePicker, { modelValue: '2026-09-04', clearable: true, 'aria-label': '发布日期' }),
    react: () => <DatePicker defaultValue="2026-09-04" clearable aria-label="发布日期" />,
    interact: async container => {
      await open(container)
      await userEvent.click(
        document.querySelector<HTMLElement>('[data-hn-calendar] [data-value="2026-09-17"]')!,
      )
    },
    settle: closed,
  },
  {
    name: 'large size calendar with min and max',
    vue: () =>
      h(VDatePicker, {
        modelValue: '2026-09-10',
        size: 'lg',
        min: '2026-09-07',
        max: '2026-09-25',
        'aria-label': '发布日期',
      }),
    react: () => (
      <DatePicker
        defaultValue="2026-09-10"
        size="lg"
        min="2026-09-07"
        max="2026-09-25"
        aria-label="发布日期"
      />
    ),
    interact: open,
    settle: positioned,
  },
  {
    name: 'escape closes the calendar',
    vue: () => h(VDatePicker, { modelValue: '2026-09-04', 'aria-label': '发布日期' }),
    react: () => <DatePicker defaultValue="2026-09-04" aria-label="发布日期" />,
    interact: async container => {
      await open(container)
      await userEvent.keyboard('{Escape}')
    },
    settle: closed,
  },
])
