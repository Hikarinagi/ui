import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VSearchInput from '@hina-ui/vue/components/search-input/SearchInput.vue'
import { SearchInput as RSearchInput } from '@hina-ui/react/components/search-input/SearchInput'
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

export default defineLiveCases('SearchInput', [
  {
    name: 'typing reveals the clear button',
    vue: () => h(VSearchInput, { 'aria-label': '搜索' }),
    react: () => <RSearchInput aria-label="搜索" />,
    interact: async container => {
      await userEvent.click(container.querySelector('input')!)
      await userEvent.keyboard('狼と香辛料')
    },
    settle: idle,
  },
  {
    name: 'Escape clears the query',
    vue: () => h(VSearchInput, { 'aria-label': '搜索' }),
    react: () => <RSearchInput aria-label="搜索" />,
    interact: async container => {
      await userEvent.click(container.querySelector('input')!)
      await userEvent.keyboard('hina')
      await idle()
      await userEvent.keyboard('{Escape}')
    },
    settle: idle,
  },
])
