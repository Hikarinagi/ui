import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VCalendar from '@hina-ui/vue/components/calendar/Calendar.vue'
import { Calendar } from '@hina-ui/react/components/calendar/Calendar'
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
      const root = document.querySelector('[data-hn-calendar]')
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

const button = (container: HTMLElement, label: string) =>
  container.querySelector<HTMLElement>(`button[aria-label="${label}"]`)!

const value = '2026-09-04'

export default defineLiveCases('Calendar', [
  {
    name: 'idle markup',
    vue: () => h(VCalendar, { modelValue: value }),
    react: () => <Calendar defaultValue={value} />,
    settle: idle,
  },
  {
    name: 'click selects a day',
    vue: () => h(VCalendar, { modelValue: value }),
    react: () => <Calendar defaultValue={value} />,
    interact: async container => {
      await userEvent.click(cell(container, '2026-09-17'))
    },
    settle: idle,
  },
  {
    name: 'arrow keys move focus across the month boundary and Enter selects',
    vue: () => h(VCalendar, { modelValue: '2026-09-28' }),
    react: () => <Calendar defaultValue="2026-09-28" />,
    interact: async container => {
      cell(container, '2026-09-28').focus()
      await userEvent.keyboard('{ArrowDown}')
      await vi.waitFor(() => {
        if (document.activeElement?.getAttribute('data-value') !== '2026-10-05')
          throw new Error('focus')
      })
      await userEvent.keyboard('{ArrowLeft}{ArrowUp}{Enter}')
    },
    settle: idle,
  },
  {
    name: 'paging with the header buttons',
    vue: () => h(VCalendar, { modelValue: value }),
    react: () => <Calendar defaultValue={value} />,
    interact: async container => {
      await userEvent.click(button(container, '下个月'))
      await userEvent.click(button(container, '下个月'))
      await userEvent.click(button(container, '上个月'))
    },
    settle: idle,
  },
  {
    name: 'paging stops at min and max',
    vue: () => h(VCalendar, { modelValue: value, min: '2026-08-10', max: '2026-10-20' }),
    react: () => <Calendar defaultValue={value} min="2026-08-10" max="2026-10-20" />,
    interact: async container => {
      await userEvent.click(button(container, '下个月'))
    },
    settle: idle,
  },
  {
    name: 'heading opens the month level',
    vue: () => h(VCalendar, { modelValue: value }),
    react: () => <Calendar defaultValue={value} />,
    interact: async container => {
      await userEvent.click(button(container, '选择月份'))
    },
    settle: level('month'),
  },
  {
    name: 'month level opens the year level',
    vue: () => h(VCalendar, { modelValue: value }),
    react: () => <Calendar defaultValue={value} />,
    interact: async container => {
      await userEvent.click(button(container, '选择月份'))
      await level('month')()
      await userEvent.click(button(container, '选择年份'))
    },
    settle: level('year'),
  },
  {
    name: 'picking a year and a month returns to the day level',
    vue: () => h(VCalendar, { modelValue: value }),
    react: () => <Calendar defaultValue={value} />,
    interact: async container => {
      await userEvent.click(button(container, '选择月份'))
      await level('month')()
      await userEvent.click(button(container, '选择年份'))
      await level('year')()
      await userEvent.keyboard('{ArrowRight}{Enter}')
      await level('month')()
      await userEvent.keyboard('{ArrowDown}{Enter}')
    },
    settle: level('day'),
  },
  {
    name: 'year paging in the year level',
    vue: () => h(VCalendar, { modelValue: value }),
    react: () => <Calendar defaultValue={value} />,
    interact: async container => {
      await userEvent.click(button(container, '选择月份'))
      await level('month')()
      await userEvent.click(button(container, '下一年'))
      await userEvent.click(button(container, '选择年份'))
      await level('year')()
      await userEvent.click(button(container, '后十二年'))
    },
    settle: level('year'),
  },
  {
    name: 'Escape returns level by level',
    vue: () => h(VCalendar, { modelValue: value }),
    react: () => <Calendar defaultValue={value} />,
    interact: async container => {
      await userEvent.click(button(container, '选择月份'))
      await level('month')()
      await userEvent.click(button(container, '选择年份'))
      await level('year')()
      await userEvent.keyboard('{Escape}')
      await level('month')()
      await userEvent.keyboard('{Escape}')
    },
    settle: level('day'),
  },
  {
    name: 'readonly ignores clicks',
    vue: () => h(VCalendar, { modelValue: value, readonly: true }),
    react: () => <Calendar defaultValue={value} readonly />,
    interact: async container => {
      await userEvent.click(cell(container, '2026-09-17'))
    },
    settle: idle,
  },
])
