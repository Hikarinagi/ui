import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VRadioGroup from '@hina-ui/vue/components/radio-group/RadioGroup.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import { RadioGroup } from '@hina-ui/react/components/radio-group/RadioGroup'
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

const options = [
  { value: 'wish', label: '想看' },
  { value: 'doing', label: '在看', description: '正在追' },
  { value: 'done', label: '看过' },
]

const radios = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('[role="radio"]'))

async function press(key: string) {
  await userEvent.keyboard(`{${key}>}`)
  await new Promise(resolve => setTimeout(resolve, 60))
  await userEvent.keyboard(`{/${key}}`)
}

export default defineLiveCases('RadioGroup', [
  {
    name: 'mounted tab stop sits on the selected radio',
    vue: () => h(VRadioGroup, { options, modelValue: 'doing', 'aria-label': '状态' }),
    react: () => <RadioGroup options={options} defaultValue="doing" aria-label="状态" />,
    settle: idle,
  },
  {
    name: 'clicking text selects',
    vue: () => h(VRadioGroup, { options, 'aria-label': '状态' }),
    react: () => <RadioGroup options={options} aria-label="状态" />,
    interact: async container => {
      await userEvent.click(container.querySelectorAll<HTMLElement>('[data-hn-radio] > span')[2]!)
    },
    settle: idle,
  },
  {
    name: 'arrow keys move and select',
    vue: () => h(VRadioGroup, { options, modelValue: 'doing', 'aria-label': '状态' }),
    react: () => <RadioGroup options={options} defaultValue="doing" aria-label="状态" />,
    interact: async container => {
      radios(container)[1]!.focus()
      await press('ArrowDown')
      await press('ArrowUp')
      await press('ArrowUp')
    },
    settle: idle,
  },
  {
    name: 'rtl horizontal arrows',
    vue: () =>
      h(VRadioGroup, {
        options,
        modelValue: 'wish',
        orientation: 'horizontal',
        dir: 'rtl',
        'aria-label': '状态',
      }),
    react: () => (
      <RadioGroup
        options={options}
        defaultValue="wish"
        orientation="horizontal"
        dir="rtl"
        aria-label="状态"
      />
    ),
    interact: async container => {
      radios(container)[0]!.focus()
      await press('ArrowLeft')
    },
    settle: idle,
  },
  {
    name: 'named group inside a form',
    vue: () => h('form', [h(VRadioGroup, { options, name: 'status', 'aria-label': '状态' })]),
    react: () => (
      <form>
        <RadioGroup options={options} name="status" aria-label="状态" />
      </form>
    ),
    interact: async container => {
      await userEvent.click(radios(container)[1]!)
    },
    settle: idle,
  },
  {
    name: 'inside a field',
    vue: () =>
      h(VFormField, { label: '可见范围', error: '请选择', required: true }, () =>
        h(VRadioGroup, { options }),
      ),
    react: () => (
      <FormField label="可见范围" error="请选择" required>
        <RadioGroup options={options} />
      </FormField>
    ),
    settle: idle,
  },
])
