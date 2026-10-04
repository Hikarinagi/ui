import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VInput from '@hina-ui/vue/components/input/Input.vue'
import { Input as RInput } from '@hina-ui/react/components/input/Input'
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

const field = (container: HTMLElement) => container.querySelector('input')!

export default defineLiveCases('Input', [
  {
    name: 'typing reveals the clear button',
    vue: () => h(VInput, { clearable: true, 'aria-label': '关键词' }),
    react: () => <RInput clearable aria-label="关键词" />,
    interact: async container => {
      await userEvent.click(field(container))
      await userEvent.keyboard('hina')
    },
    settle: idle,
  },
  {
    name: 'clear button empties the field and keeps focus',
    vue: () => h(VInput, { clearable: true, 'aria-label': '关键词' }, { leading: () => h('svg') }),
    react: () => <RInput clearable aria-label="关键词" leading={<svg />} />,
    interact: async container => {
      await userEvent.click(field(container))
      await userEvent.keyboard('hina')
      await vi.waitFor(() => {
        if (!container.querySelector('button')) throw new Error('no clear button')
      })
      await userEvent.click(container.querySelector('button')!)
    },
    settle: idle,
  },
  {
    name: 'clicking the trailing cell focuses the field',
    vue: () => h(VInput, { 'aria-label': '体重' }, { trailing: () => 'kg' }),
    react: () => <RInput aria-label="体重" trailing="kg" />,
    interact: async container => {
      await userEvent.click(container.querySelector('[data-hn-input] > span')!)
      await userEvent.keyboard('12')
    },
    settle: idle,
  },
])
