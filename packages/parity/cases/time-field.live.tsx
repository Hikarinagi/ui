import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VTimeField from '@hina-ui/vue/components/time-field/TimeField.vue'
import { TimeField } from '@hina-ui/react/components/time-field/TimeField'
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

export default defineLiveCases('TimeField', [
  {
    name: 'idle markup',
    vue: () => h(VTimeField, { modelValue: '09:30', 'aria-label': '时间' }),
    react: () => <TimeField value="09:30" aria-label="时间" />,
    settle: idle,
  },
  {
    name: 'typing hour and minute',
    vue: () => h(VTimeField, { clearable: true, 'aria-label': '时间' }),
    react: () => <TimeField clearable aria-label="时间" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('0930')
    },
    settle: idle,
  },
  {
    name: 'seconds granularity typing',
    vue: () => h(VTimeField, { granularity: 'second', 'aria-label': '时间' }),
    react: () => <TimeField granularity="second" aria-label="时间" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('093015')
    },
    settle: idle,
  },
  {
    name: 'hour granularity stepping',
    vue: () => h(VTimeField, { granularity: 'hour', modelValue: '09:00', 'aria-label': '时间' }),
    react: () => <TimeField granularity="hour" defaultValue="09:00" aria-label="时间" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('{ArrowUp}{ArrowUp}')
    },
    settle: idle,
  },
  {
    name: 'twelve hour cycle toggles the day period',
    vue: () => h(VTimeField, { hourCycle: 12, 'aria-label': '时间' }),
    react: () => <TimeField hourCycle={12} aria-label="时间" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('0830')
      await userEvent.keyboard('p')
    },
    settle: idle,
  },
  {
    name: 'minute step snaps on arrow keys',
    vue: () => h(VTimeField, { minuteStep: 15, placeholder: '09:00', 'aria-label': '时间' }),
    react: () => <TimeField minuteStep={15} placeholder="09:00" aria-label="时间" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('09')
      await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}')
    },
    settle: idle,
  },
  {
    name: 'minute step snaps typed minutes on blur',
    vue: () => h(VTimeField, { minuteStep: 15, 'aria-label': '时间' }),
    react: () => <TimeField minuteStep={15} aria-label="时间" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('0922')
      await userEvent.tab()
    },
    settle: idle,
  },
  {
    name: 'above max typing marks the field invalid',
    vue: () => h(VTimeField, { max: '18:00', 'aria-label': '时间' }),
    react: () => <TimeField max="18:00" aria-label="时间" />,
    interact: async container => {
      await userEvent.click(spins(container)[0]!)
      await userEvent.keyboard('2300')
    },
    settle: idle,
  },
])
