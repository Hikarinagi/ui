import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VCloseButton from '@hina-ui/vue/components/close-button/CloseButton.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import { CloseButton } from '@hina-ui/react/components/close-button/CloseButton'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { defineLiveCases, frames } from '../src/live'
import { wait } from './dialog.live'

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(
      '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]',
    )
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  await frames()
}

async function hover(container: HTMLElement) {
  await userEvent.hover(container.querySelector('button')!)
}

export default defineLiveCases('CloseButton', [
  {
    name: 'tooltip shows the locale label on hover',
    vue: () => h(VTooltipProvider, null, () => h(VCloseButton, { tooltip: true })),
    react: () => (
      <TooltipProvider>
        <CloseButton tooltip />
      </TooltipProvider>
    ),
    interact: hover,
    settle: positioned,
  },
  {
    name: 'tooltip with a custom label and side',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h(VCloseButton, { label: '关闭预览', tooltip: true, side: 'right' }),
      ),
    react: () => (
      <TooltipProvider>
        <CloseButton label="关闭预览" tooltip side="right" />
      </TooltipProvider>
    ),
    interact: hover,
    settle: positioned,
  },
  {
    name: 'tooltip stays hidden by default inside a provider',
    vue: () => h(VTooltipProvider, null, () => h(VCloseButton)),
    react: () => (
      <TooltipProvider>
        <CloseButton />
      </TooltipProvider>
    ),
    interact: hover,
    settle: async () => {
      await wait(400)
      await frames()
    },
  },
])
