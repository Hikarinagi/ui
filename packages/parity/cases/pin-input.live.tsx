import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import VPinInput from '@hina-ui/vue/components/pin-input/PinInput.vue'
import { PinInput } from '@hina-ui/react/components/pin-input/PinInput'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  await new Promise(resolve => setTimeout(resolve, 200))
  await frames(4)
}

const native = (container: HTMLElement) => container.querySelector<HTMLInputElement>('input')!

export default defineLiveCases('PinInput', [
  {
    name: 'mounted cells',
    vue: () => h(VPinInput, { length: 4, 'aria-label': '验证码' }),
    react: () => <PinInput length={4} aria-label="验证码" />,
    settle: idle,
  },
  {
    name: 'typing fills the cells in order',
    vue: () => h(VPinInput, { length: 4, placeholder: '○', 'aria-label': '验证码' }),
    react: () => <PinInput length={4} placeholder="○" aria-label="验证码" />,
    interact: async container => {
      native(container).focus()
      await userEvent.keyboard('1a')
    },
    settle: idle,
  },
  {
    name: 'complete entry and backspace',
    vue: () => h(VPinInput, { length: 4, name: 'code', 'aria-label': '验证码' }),
    react: () => <PinInput length={4} name="code" aria-label="验证码" />,
    interact: async container => {
      native(container).focus()
      await userEvent.keyboard('1234')
      await userEvent.keyboard('{Backspace}{Backspace}')
    },
    settle: idle,
  },
  {
    name: 'inserted text is distributed over the cells',
    vue: () => h(VPinInput, { length: 6, 'aria-label': '验证码' }),
    react: () => <PinInput length={6} aria-label="验证码" />,
    interact: async container => {
      native(container).focus()
      document.execCommand('insertText', false, ' 493 215 ')
    },
    settle: idle,
  },
  {
    name: 'number mode rejects letters',
    vue: () => h(VPinInput, { length: 4, type: 'number', 'aria-label': '验证码' }),
    react: () => <PinInput length={4} type="number" aria-label="验证码" />,
    interact: async container => {
      native(container).focus()
      await userEvent.keyboard('a7b8')
    },
    settle: idle,
  },
  {
    name: 'arrows move to a filled cell and typing overwrites it',
    vue: () => h(VPinInput, { length: 4, otp: true, mask: true, 'aria-label': '验证码' }),
    react: () => <PinInput length={4} otp mask aria-label="验证码" />,
    interact: async container => {
      native(container).focus()
      await userEvent.keyboard('123')
      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}9{End}4')
    },
    settle: idle,
  },
  {
    name: 'disabled invalid cells',
    vue: () => h(VPinInput, { length: 3, disabled: true, invalid: true, modelValue: '1' }),
    react: () => <PinInput length={3} disabled invalid defaultValue="1" />,
    settle: idle,
  },
])
