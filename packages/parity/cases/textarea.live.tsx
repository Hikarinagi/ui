import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VTextarea from '@hina-ui/vue/components/textarea/Textarea.vue'
import { Textarea as RTextarea } from '@hina-ui/react/components/textarea/Textarea'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  await vi.waitFor(
    () => {
      const running = document
        .getAnimations()
        .filter(a => a.playState === 'running' && !(a.timeline && 'source' in a.timeline))
      if (running.length) throw new Error('busy')
      if (!document.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('init')
    },
    { timeout: 3000 },
  )
  await new Promise(resolve => setTimeout(resolve, 400))
  await frames(4)
}

export default defineLiveCases('Textarea', [
  {
    name: 'initial markup with a value',
    vue: () => h(VTextarea, { modelValue: '一\n二\n三\n四', rows: 2, 'aria-label': '简介' }),
    react: () => <RTextarea defaultValue={'一\n二\n三\n四'} rows={2} aria-label="简介" />,
    settle: idle,
  },
  {
    name: 'autosize grows while typing',
    vue: () => h(VTextarea, { autosize: { minRows: 2, maxRows: 4 }, 'aria-label': '简介' }),
    react: () => <RTextarea autosize={{ minRows: 2, maxRows: 4 }} aria-label="简介" />,
    interact: async container => {
      await userEvent.click(container.querySelector('textarea')!)
      await userEvent.keyboard('一{Enter}二{Enter}三')
    },
    settle: idle,
  },
])
