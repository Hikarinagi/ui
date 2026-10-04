import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VCopyButton from '@hina-ui/vue/components/copy-button/CopyButton.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import { CopyButton } from '@hina-ui/react/components/copy-button/CopyButton'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { defineLiveCases, frames } from '../src/live'

function stubClipboard() {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: () => Promise.resolve() },
    configurable: true,
  })
}

async function copied() {
  await vi.waitFor(() => {
    const button = document.querySelector('button')!
    if (button.getAttribute('aria-label') !== '已复制') throw new Error('not copied')
    const icons = button.querySelectorAll('svg')
    if (icons.length !== 1 || icons[0]!.classList.contains('hn-transition-base'))
      throw new Error('icon still entering')
  })
  await frames()
}

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(
      '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]',
    )
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  await frames()
}

export default defineLiveCases('CopyButton', [
  {
    name: 'idle after mount',
    vue: () => h(VCopyButton, { text: 'Hina UI' }),
    react: () => <CopyButton text="Hina UI" />,
    settle: () => frames(),
  },
  {
    name: 'copied feedback after the icon transition',
    vue: () => h(VCopyButton, { text: 'Hina UI', timeout: 5000 }),
    react: () => <CopyButton text="Hina UI" timeout={5000} />,
    interact: container => {
      stubClipboard()
      container.querySelector('button')!.click()
    },
    settle: copied,
  },
  {
    name: 'custom label copied feedback',
    vue: () => h(VCopyButton, { text: 'x', label: '复制安装命令', size: 'md', timeout: 5000 }),
    react: () => <CopyButton text="x" label="复制安装命令" size="md" timeout={5000} />,
    interact: container => {
      stubClipboard()
      container.querySelector('button')!.click()
    },
    settle: copied,
  },
  {
    name: 'tooltip on hover inside a provider',
    vue: () =>
      h(VTooltipProvider, { delayDuration: 0 }, () =>
        h(VCopyButton, { text: 'hina-2f9c41', label: '复制订单编号', tooltip: true }),
      ),
    react: () => (
      <TooltipProvider delayDuration={0}>
        <CopyButton text="hina-2f9c41" label="复制订单编号" tooltip />
      </TooltipProvider>
    ),
    interact: async container => {
      await userEvent.hover(container.querySelector('button')!)
    },
    settle: positioned,
  },
])
