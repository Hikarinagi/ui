import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import VPinInput from '@hina-ui/vue/components/pin-input/PinInput.vue'
import { PinInput } from '@hina-ui/react/components/pin-input/PinInput'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  await new Promise(resolve => setTimeout(resolve, 200))
  await frames(4)
}

const cells = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLInputElement>('input:not([tabindex="-1"])'))

export default defineLiveCases('PinInput', [
  {
    name: 'mounted cells register and drop the completed state',
    vue: () => h(VPinInput, { length: 4, 'aria-label': '验证码' }),
    react: () => <PinInput length={4} aria-label="验证码" />,
    settle: idle,
  },
  {
    name: 'typing advances focus and fills the value',
    vue: () => h(VPinInput, { length: 4, placeholder: '○', 'aria-label': '验证码' }),
    react: () => <PinInput length={4} placeholder="○" aria-label="验证码" />,
    interact: async container => {
      cells(container)[0]!.focus()
      await userEvent.keyboard('12')
    },
    settle: idle,
  },
  {
    name: 'complete entry and backspace',
    vue: () => h(VPinInput, { length: 4, name: 'code', 'aria-label': '验证码' }),
    react: () => <PinInput length={4} name="code" aria-label="验证码" />,
    interact: async container => {
      cells(container)[0]!.focus()
      await userEvent.keyboard('1234')
      await userEvent.keyboard('{Backspace}{Backspace}')
    },
    settle: idle,
  },
  {
    name: 'paste distributes characters',
    vue: () => h(VPinInput, { length: 6, 'aria-label': '验证码' }),
    react: () => <PinInput length={6} aria-label="验证码" />,
    interact: async container => {
      const first = cells(container)[0]!
      first.focus()
      const data = new DataTransfer()
      data.setData('text', '493215')
      first.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true }))
    },
    settle: idle,
  },
  {
    name: 'number mode rejects letters',
    vue: () => h(VPinInput, { length: 4, type: 'number', 'aria-label': '验证码' }),
    react: () => <PinInput length={4} type="number" aria-label="验证码" />,
    interact: async container => {
      cells(container)[0]!.focus()
      await userEvent.keyboard('a7b8')
    },
    settle: idle,
  },
  {
    name: 'otp focus jumps to the first empty cell and arrows move',
    vue: () => h(VPinInput, { length: 4, otp: true, mask: true, 'aria-label': '验证码' }),
    react: () => <PinInput length={4} otp mask aria-label="验证码" />,
    interact: async container => {
      cells(container)[2]!.focus()
      await userEvent.keyboard('5')
      await userEvent.keyboard('{ArrowLeft}{End}')
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
