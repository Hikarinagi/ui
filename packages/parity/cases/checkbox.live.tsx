import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VCheckbox from '@hina-ui/vue/components/checkbox/Checkbox.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import { Checkbox } from '@hina-ui/react/components/checkbox/Checkbox'
import { FormField } from '@hina-ui/react/components/form-field/FormField'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  await vi.waitFor(
    () => {
      const running = document.getAnimations().filter(a => a.playState === 'running')
      if (running.length) throw new Error('busy')
    },
    { timeout: 3000, interval: 16 },
  )
  await new Promise(resolve => setTimeout(resolve, 300))
  await frames(4)
}

const box = (container: HTMLElement) => container.querySelector<HTMLElement>('[role="checkbox"]')!

export default defineLiveCases('Checkbox', [
  {
    name: 'mounted markup drops the hidden input outside a form',
    vue: () => h(VCheckbox, { name: 'agree', description: '每周一封' }, () => '订阅周报'),
    react: () => (
      <Checkbox name="agree" description="每周一封">
        订阅周报
      </Checkbox>
    ),
    settle: idle,
  },
  {
    name: 'inside a form the hidden input follows the state',
    vue: () => h('form', [h(VCheckbox, { name: 'agree' }, () => '同意')]),
    react: () => (
      <form>
        <Checkbox name="agree">同意</Checkbox>
      </form>
    ),
    interact: async container => {
      await userEvent.click(box(container))
    },
    settle: idle,
  },
  {
    name: 'clicking the text checks the box',
    vue: () => h(VCheckbox, null, () => '订阅周报'),
    react: () => <Checkbox>订阅周报</Checkbox>,
    interact: async container => {
      await userEvent.click(container.querySelector('label > span')!)
    },
    settle: idle,
  },
  {
    name: 'space toggles and enter does not',
    vue: () => h(VCheckbox, { 'aria-label': '全选' }),
    react: () => <Checkbox aria-label="全选" />,
    interact: async container => {
      box(container).focus()
      await userEvent.keyboard(' ')
      await userEvent.keyboard('{Enter}')
    },
    settle: idle,
  },
  {
    name: 'indeterminate becomes checked on click',
    vue: () => h(VCheckbox, { modelValue: 'indeterminate', 'aria-label': '部分' }),
    react: () => <Checkbox defaultChecked="indeterminate" aria-label="部分" />,
    interact: async container => {
      await userEvent.click(box(container))
    },
    settle: idle,
  },
  {
    name: 'unchecking removes the check',
    vue: () => h(VCheckbox, null, () => '订阅周报'),
    react: () => <Checkbox>订阅周报</Checkbox>,
    interact: async container => {
      await userEvent.click(box(container))
      await idle()
      await userEvent.click(box(container))
    },
    settle: idle,
  },
  {
    name: 'a field label names the box',
    vue: () =>
      h(VFormField, { label: '协议', description: '必须同意', required: true }, () =>
        h(VCheckbox, null, () => '同意条款'),
      ),
    react: () => (
      <FormField label="协议" description="必须同意" required>
        <Checkbox>同意条款</Checkbox>
      </FormField>
    ),
    settle: idle,
  },
  {
    name: 'disabled ignores clicks',
    vue: () => h(VCheckbox, { disabled: true }, () => '禁用'),
    react: () => <Checkbox disabled>禁用</Checkbox>,
    interact: async container => {
      container.querySelector<HTMLElement>('label > span')!.click()
    },
    settle: idle,
  },
])
