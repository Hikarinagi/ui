import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VToggle from '@hina-ui/vue/components/toggle/Toggle.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import { Toggle } from '@hina-ui/react/components/toggle/Toggle'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  await vi.waitFor(
    () => {
      const running = document.getAnimations().filter(a => a.playState === 'running')
      if (running.length || document.querySelector('[data-pressed]')) throw new Error('busy')
    },
    { timeout: 3000, interval: 16 },
  )
  await new Promise(resolve => setTimeout(resolve, 400))
  await frames(4)
}

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(
      '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]',
    )
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  await idle()
}

const button = (container: HTMLElement) => container.querySelector<HTMLElement>('[data-hn-toggle]')!

export default defineLiveCases('Toggle', [
  {
    name: 'click presses the toggle',
    vue: () => h(VToggle, null, () => '加粗'),
    react: () => <Toggle>加粗</Toggle>,
    interact: async container => {
      await userEvent.click(button(container))
    },
    settle: idle,
  },
  {
    name: 'second click releases it',
    vue: () => h(VToggle, { modelValue: true }, () => '加粗'),
    react: () => <Toggle defaultValue>加粗</Toggle>,
    interact: async container => {
      await userEvent.click(button(container))
    },
    settle: idle,
  },
  {
    name: 'pressed icon swaps in',
    vue: () =>
      h(
        VToggle,
        { label: '收藏' },
        {
          icon: () => h('svg', { 'data-icon': 'off' }),
          'pressed-icon': () => h('svg', { 'data-icon': 'on' }),
        },
      ),
    react: () => (
      <Toggle
        label="收藏"
        renderIcon={() => <svg data-icon="off" />}
        pressedIcon={<svg data-icon="on" />}
      />
    ),
    interact: async container => {
      await userEvent.click(button(container))
    },
    settle: idle,
  },
  {
    name: 'keyboard space toggles',
    vue: () => h(VToggle, { variant: 'outline' }, () => '描边'),
    react: () => <Toggle variant="outline">描边</Toggle>,
    interact: async container => {
      button(container).focus()
      await userEvent.keyboard(' ')
    },
    settle: idle,
  },
  {
    name: 'hovering an icon toggle shows its tooltip',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h(
          VToggle,
          { label: '收藏', side: 'bottom' },
          { icon: () => h('svg', { 'data-icon': 'off' }) },
        ),
      ),
    react: () => (
      <TooltipProvider>
        <Toggle label="收藏" side="bottom" renderIcon={() => <svg data-icon="off" />} />
      </TooltipProvider>
    ),
    interact: async container => {
      await userEvent.hover(button(container))
    },
    settle: positioned,
  },
  {
    name: 'disabled ignores clicks',
    vue: () => h(VToggle, { disabled: true }, () => '禁用'),
    react: () => <Toggle disabled>禁用</Toggle>,
    interact: async container => {
      button(container).click()
    },
    settle: idle,
  },
])
