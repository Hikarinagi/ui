import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VDateField from '@hina-ui/vue/components/date-field/DateField.vue'
import { DateField } from '@hina-ui/react/components/date-field/DateField'
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

export default defineLiveCases('DateField', [
  {
    name: 'idle markup',
    vue: () => h(VDateField, { modelValue: '2026-09-04', 'aria-label': '日期' }),
    react: () => <DateField value="2026-09-04" aria-label="日期" />,
    settle: idle,
  },
  {
    name: 'typing a full date fills every segment and reveals the clear button',
    vue: () => h(VDateField, { clearable: true, placeholder: '2026-01-01', 'aria-label': '日期' }),
    react: () => <DateField clearable placeholder="2026-01-01" aria-label="日期" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('20260904')
    },
    settle: idle,
  },
  {
    name: 'partial typing keeps the remaining placeholders',
    vue: () => h(VDateField, { placeholder: '2026-01-01', 'aria-label': '日期' }),
    react: () => <DateField placeholder="2026-01-01" aria-label="日期" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('2025')
      await userEvent.keyboard('1')
    },
    settle: idle,
  },
  {
    name: 'arrow keys step and move between segments',
    vue: () => h(VDateField, { clearable: true, placeholder: '2026-09-04', 'aria-label': '日期' }),
    react: () => <DateField clearable placeholder="2026-09-04" aria-label="日期" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('{ArrowUp}{ArrowRight}{ArrowDown}{ArrowDown}{ArrowRight}{ArrowUp}')
    },
    settle: idle,
  },
  {
    name: 'backspace empties a segment and clears the value',
    vue: () => h(VDateField, { clearable: true, placeholder: '2026-01-01', 'aria-label': '日期' }),
    react: () => <DateField clearable placeholder="2026-01-01" aria-label="日期" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('20260904')
      await userEvent.keyboard('{Backspace}')
    },
    settle: idle,
  },
  {
    name: 'clear button empties every segment',
    vue: () => h(VDateField, { clearable: true, placeholder: '2026-01-01', 'aria-label': '日期' }),
    react: () => <DateField clearable placeholder="2026-01-01" aria-label="日期" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('20260904')
      await vi.waitFor(() => {
        if (!container.querySelector('button[aria-label="清除"]')) throw new Error('no clear')
      })
      await userEvent.click(container.querySelector('button[aria-label="清除"]')!)
    },
    settle: idle,
  },
  {
    name: 'minute granularity typing',
    vue: () =>
      h(VDateField, {
        granularity: 'minute',
        placeholder: '2026-01-01T00:00',
        'aria-label': '时间',
      }),
    react: () => (
      <DateField granularity="minute" placeholder="2026-01-01T00:00" aria-label="时间" />
    ),
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('202609040915')
    },
    settle: idle,
  },
  {
    name: 'out of range typing marks the field invalid',
    vue: () =>
      h(VDateField, { max: '2026-09-01', placeholder: '2026-01-01', 'aria-label': '日期' }),
    react: () => <DateField max="2026-09-01" placeholder="2026-01-01" aria-label="日期" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('20260904')
    },
    settle: idle,
  },
  {
    name: 'clicking the host focuses the first empty segment',
    vue: () => h(VDateField, { placeholder: '2026-01-01', 'aria-label': '日期' }),
    react: () => <DateField placeholder="2026-01-01" aria-label="日期" />,
    interact: async container => {
      const host = container.querySelector<HTMLElement>('[data-hn-date-field]')!
      await userEvent.click(host, { position: { x: 4, y: Math.round(host.offsetHeight / 2) } })
      await userEvent.keyboard('2026')
    },
    settle: idle,
  },
  {
    name: 'right to left swaps the arrow direction',
    vue: () => h(VDateField, { dir: 'rtl', placeholder: '2026-09-04', 'aria-label': '日期' }),
    react: () => <DateField dir="rtl" placeholder="2026-09-04" aria-label="日期" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('{ArrowLeft}{ArrowUp}{ArrowLeft}{ArrowUp}{ArrowRight}{ArrowUp}')
    },
    settle: idle,
  },
])
