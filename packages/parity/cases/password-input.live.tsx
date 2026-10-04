import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VPasswordInput from '@hina-ui/vue/components/password-input/PasswordInput.vue'
import { PasswordInput as RPasswordInput } from '@hina-ui/react/components/password-input/PasswordInput'
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

export default defineLiveCases('PasswordInput', [
  {
    name: 'reveal toggles type, label and icon',
    vue: () => h(VPasswordInput, { 'aria-label': '密码' }),
    react: () => <RPasswordInput aria-label="密码" />,
    interact: async container => {
      await userEvent.click(container.querySelector('input')!)
      await userEvent.keyboard('secret')
      await userEvent.click(container.querySelector('button')!)
    },
    settle: idle,
  },
  {
    name: 'hide again',
    vue: () => h(VPasswordInput, { 'aria-label': '密码', modelValue: 'secret' }),
    react: () => <RPasswordInput aria-label="密码" defaultValue="secret" />,
    interact: async container => {
      await userEvent.click(container.querySelector('button')!)
      await idle()
      await userEvent.click(container.querySelector('button')!)
    },
    settle: idle,
  },
])
