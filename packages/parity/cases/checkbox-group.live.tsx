import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VCheckboxGroup from '@hina-ui/vue/components/checkbox-group/CheckboxGroup.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import { CheckboxGroup } from '@hina-ui/react/components/checkbox-group/CheckboxGroup'
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
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说', description: '文库本' },
  { value: 'manga', label: '漫画', disabled: true },
]

const boxes = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('[role="checkbox"]'))

export default defineLiveCases('CheckboxGroup', [
  {
    name: 'clicking text adds values and space removes them',
    vue: () => h(VCheckboxGroup, { options, 'aria-label': '类型' }),
    react: () => <CheckboxGroup options={options} aria-label="类型" />,
    interact: async container => {
      await userEvent.click(
        container.querySelectorAll<HTMLElement>('[data-hn-checkbox] > span')[1]!,
      )
      await userEvent.click(boxes(container)[0]!)
      await userEvent.keyboard(' ')
    },
    settle: idle,
  },
  {
    name: 'disabled options ignore clicks',
    vue: () => h(VCheckboxGroup, { options, modelValue: ['gal'] }),
    react: () => <CheckboxGroup options={options} defaultValue={['gal']} />,
    interact: async container => {
      container.querySelectorAll<HTMLElement>('[data-hn-checkbox] > span')[3]!.click()
    },
    settle: idle,
  },
  {
    name: 'named group inside a form renders the hidden inputs',
    vue: () => h('form', [h(VCheckboxGroup, { options, name: 'kinds', modelValue: ['gal'] })]),
    react: () => (
      <form>
        <CheckboxGroup options={options} name="kinds" defaultValue={['gal']} />
      </form>
    ),
    interact: async container => {
      await userEvent.click(boxes(container)[1]!)
    },
    settle: idle,
  },
  {
    name: 'inside a field',
    vue: () =>
      h(VFormField, { label: '兴趣', description: '选一到两项', error: '至少一项' }, () =>
        h(VCheckboxGroup, { options, orientation: 'horizontal' }),
      ),
    react: () => (
      <FormField label="兴趣" description="选一到两项" error="至少一项">
        <CheckboxGroup options={options} orientation="horizontal" />
      </FormField>
    ),
    settle: idle,
  },
])
