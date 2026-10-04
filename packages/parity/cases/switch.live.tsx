import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VSwitch from '@hina-ui/vue/components/switch/Switch.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import { Switch } from '@hina-ui/react/components/switch/Switch'
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

const track = (container: HTMLElement) => container.querySelector<HTMLElement>('[role="switch"]')!

export default defineLiveCases('Switch', [
  {
    name: 'clicking the track turns it on',
    vue: () => h(VSwitch, { description: '播放完自动跳到下一话' }, () => '自动播放'),
    react: () => <Switch description="播放完自动跳到下一话">自动播放</Switch>,
    interact: async container => {
      await userEvent.click(track(container))
    },
    settle: idle,
  },
  {
    name: 'clicking the text toggles back off',
    vue: () => h(VSwitch, { modelValue: true }, () => '自动播放'),
    react: () => <Switch defaultChecked>自动播放</Switch>,
    interact: async container => {
      await userEvent.click(container.querySelector('label > span')!)
    },
    settle: idle,
  },
  {
    name: 'space and enter both toggle',
    vue: () => h(VSwitch, { 'aria-label': '自动播放' }),
    react: () => <Switch aria-label="自动播放" />,
    interact: async container => {
      track(container).focus()
      await userEvent.keyboard(' ')
      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard('{Enter}')
    },
    settle: idle,
  },
  {
    name: 'named switch inside a form',
    vue: () => h('form', [h(VSwitch, { name: 'public' }, () => '公开')]),
    react: () => (
      <form>
        <Switch name="public">公开</Switch>
      </form>
    ),
    interact: async container => {
      await userEvent.click(track(container))
    },
    settle: idle,
  },
  {
    name: 'a field label names the track',
    vue: () =>
      h(VFormField, { label: '通知', description: '每天推送' }, () =>
        h(VSwitch, { controlPlacement: 'end', block: true }, () => '接收推送'),
      ),
    react: () => (
      <FormField label="通知" description="每天推送">
        <Switch controlPlacement="end" block>
          接收推送
        </Switch>
      </FormField>
    ),
    settle: idle,
  },
])
