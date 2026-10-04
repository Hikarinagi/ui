import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VDateRangeField from '@hina-ui/vue/components/date-range-field/DateRangeField.vue'
import { DateRangeField } from '@hina-ui/react/components/date-range-field/DateRangeField'
import { defineLiveCases, frames } from '../src/live'

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

const spins = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('[role="spinbutton"]'))

export default defineLiveCases('DateRangeField', [
  {
    name: 'idle markup',
    vue: () =>
      h(VDateRangeField, {
        modelValue: { start: '2026-09-01', end: '2026-09-30' },
        'aria-label': '期间',
      }),
    react: () => (
      <DateRangeField value={{ start: '2026-09-01', end: '2026-09-30' }} aria-label="期间" />
    ),
    settle: idle,
  },
  {
    name: 'typing both sides crosses the separator',
    vue: () =>
      h(VDateRangeField, { clearable: true, placeholder: '2026-01-01', 'aria-label': '期间' }),
    react: () => <DateRangeField clearable placeholder="2026-01-01" aria-label="期间" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('2026090120260930')
    },
    settle: idle,
  },
  {
    name: 'start only keeps the end placeholders',
    vue: () => h(VDateRangeField, { placeholder: '2026-01-01', 'aria-label': '期间' }),
    react: () => <DateRangeField placeholder="2026-01-01" aria-label="期间" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('20260901')
    },
    settle: idle,
  },
  {
    name: 'reversed range is invalid',
    vue: () => h(VDateRangeField, { placeholder: '2026-01-01', 'aria-label': '期间' }),
    react: () => <DateRangeField placeholder="2026-01-01" aria-label="期间" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('2026093020260901')
    },
    settle: idle,
  },
  {
    name: 'arrow keys move across both sides',
    vue: () =>
      h(VDateRangeField, {
        modelValue: { start: '2026-09-01', end: '2026-09-30' },
        'aria-label': '期间',
      }),
    react: () => (
      <DateRangeField defaultValue={{ start: '2026-09-01', end: '2026-09-30' }} aria-label="期间" />
    ),
    interact: async container => {
      await userEvent.click(spins(container)[2]!)
      await userEvent.keyboard('{ArrowRight}{ArrowUp}{ArrowRight}{ArrowRight}{ArrowDown}')
    },
    settle: idle,
  },
  {
    name: 'clear button empties both sides',
    vue: () =>
      h(VDateRangeField, { clearable: true, placeholder: '2026-01-01', 'aria-label': '期间' }),
    react: () => <DateRangeField clearable placeholder="2026-01-01" aria-label="期间" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('20260901')
      await vi.waitFor(() => {
        if (!container.querySelector('button[aria-label="清除"]')) throw new Error('no clear')
      })
      await userEvent.click(container.querySelector('button[aria-label="清除"]')!)
    },
    settle: idle,
  },
])
