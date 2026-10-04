import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VMonthGrid from '@hina-ui/vue/components/month-grid/MonthGrid.vue'
import { MonthGrid } from '@hina-ui/react/components/month-grid/MonthGrid'
import { defineLiveCases, frames } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'

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

function picker(name: 'month' | 'year') {
  return async () => {
    await vi.waitFor(() => {
      const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
      if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
      const selector = `[data-radix-${name}-picker-cell-trigger],[data-reka-${name}-picker-cell-trigger]`
      if (!document.activeElement?.matches(selector)) throw new Error('not focused')
    })
    await idle()
  }
}

async function closed() {
  await vi.waitFor(() => {
    if (document.querySelector(wrapperSelector)) throw new Error('still open')
  })
  await idle()
}

const props = { month: '2026-09', today: '2026-09-21', style: 'width:672px' }
const reactStyle = { width: '672px' }

const heading = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('button[aria-haspopup="dialog"]')!

export default defineLiveCases('MonthGrid', [
  {
    name: 'idle markup',
    vue: () => h(VMonthGrid, props),
    react: () => <MonthGrid defaultMonth="2026-09" today="2026-09-21" style={reactStyle} />,
    settle: idle,
  },
  {
    name: 'next month and back to today',
    vue: () => h(VMonthGrid, props),
    react: () => <MonthGrid defaultMonth="2026-09" today="2026-09-21" style={reactStyle} />,
    interact: async container => {
      await userEvent.click(container.querySelector<HTMLElement>('button[aria-label="下个月"]')!)
      await userEvent.click(container.querySelector<HTMLElement>('button[aria-label="下个月"]')!)
    },
    settle: idle,
  },
  {
    name: 'heading opens the month picker popover',
    vue: () => h(VMonthGrid, props),
    react: () => <MonthGrid defaultMonth="2026-09" today="2026-09-21" style={reactStyle} />,
    interact: async container => {
      await userEvent.click(heading(container))
    },
    settle: picker('month'),
  },
  {
    name: 'year level inside the popover',
    vue: () => h(VMonthGrid, props),
    react: () => <MonthGrid defaultMonth="2026-09" today="2026-09-21" style={reactStyle} />,
    interact: async container => {
      await userEvent.click(heading(container))
      await picker('month')()
      await userEvent.click(document.querySelector<HTMLElement>('button[aria-label="选择年份"]')!)
    },
    settle: picker('year'),
  },
  {
    name: 'picking a month closes the popover and navigates',
    vue: () => h(VMonthGrid, props),
    react: () => <MonthGrid defaultMonth="2026-09" today="2026-09-21" style={reactStyle} />,
    interact: async container => {
      await userEvent.click(heading(container))
      await picker('month')()
      await userEvent.keyboard('{ArrowDown}{Enter}')
    },
    settle: closed,
  },
  {
    name: 'Escape from the year level returns to months',
    vue: () => h(VMonthGrid, props),
    react: () => <MonthGrid defaultMonth="2026-09" today="2026-09-21" style={reactStyle} />,
    interact: async container => {
      await userEvent.click(heading(container))
      await picker('month')()
      await userEvent.click(document.querySelector<HTMLElement>('button[aria-label="选择年份"]')!)
      await picker('year')()
      await userEvent.keyboard('{Escape}')
    },
    settle: picker('month'),
  },
  {
    name: 'rtl picker keeps direction',
    vue: () => h(VMonthGrid, { ...props, dir: 'rtl' }),
    react: () => (
      <MonthGrid defaultMonth="2026-09" today="2026-09-21" style={reactStyle} dir="rtl" />
    ),
    interact: async container => {
      await userEvent.click(heading(container))
      await picker('month')()
      await userEvent.keyboard('{ArrowRight}')
    },
    settle: picker('month'),
  },
])
