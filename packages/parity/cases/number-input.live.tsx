import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VNumberInput from '@hina-ui/vue/components/number-input/NumberInput.vue'
import { NumberInput as RNumberInput } from '@hina-ui/react/components/number-input/NumberInput'
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

const buttons = (container: HTMLElement) => container.querySelectorAll('button')

export default defineLiveCases('NumberInput', [
  {
    name: 'idle markup',
    vue: () => h(VNumberInput, { defaultValue: 5, 'aria-label': '数量' }),
    react: () => <RNumberInput defaultValue={5} aria-label="数量" />,
    settle: idle,
  },
  {
    name: 'stepping up to the maximum disables the increment',
    vue: () =>
      h(VNumberInput, { defaultValue: 9, min: 0, max: 10, step: 0.5, 'aria-label': '数量' }),
    react: () => <RNumberInput defaultValue={9} min={0} max={10} step={0.5} aria-label="数量" />,
    interact: async container => {
      await userEvent.click(buttons(container)[0]!)
      await userEvent.click(buttons(container)[0]!)
    },
    settle: idle,
  },
  {
    name: 'keyboard stepping and Home',
    vue: () => h(VNumberInput, { defaultValue: 5, min: 1, max: 9, 'aria-label': '数量' }),
    react: () => <RNumberInput defaultValue={5} min={1} max={9} aria-label="数量" />,
    interact: async container => {
      await userEvent.click(container.querySelector('input')!)
      await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowDown}{Home}')
    },
    settle: idle,
  },
  {
    name: 'typed value is parsed and clamped on Enter',
    vue: () => h(VNumberInput, { min: 0, max: 10, 'aria-label': '数量' }),
    react: () => <RNumberInput min={0} max={10} aria-label="数量" />,
    interact: async container => {
      await userEvent.click(container.querySelector('input')!)
      await userEvent.keyboard('a99{Enter}')
    },
    settle: idle,
  },
  {
    name: 'currency format after blur',
    vue: () =>
      h(VNumberInput, {
        locale: 'de-DE',
        formatOptions: { style: 'currency', currency: 'EUR' },
        'aria-label': '价格',
      }),
    react: () => (
      <RNumberInput
        locale="de-DE"
        formatOptions={{ style: 'currency', currency: 'EUR' }}
        aria-label="价格"
      />
    ),
    interact: async container => {
      await userEvent.click(container.querySelector('input')!)
      await userEvent.keyboard('1234,5')
      await userEvent.tab()
    },
    settle: idle,
  },
])
