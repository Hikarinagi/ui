import { h } from 'vue'
import { vi } from 'vitest'
import VLineClamp from '@hina-ui/vue/components/line-clamp/LineClamp.vue'
import { LineClamp } from '@hina-ui/react/components/line-clamp/LineClamp'
import { defineLiveCases, frames } from '../src/live'

const long = '行商罗伦斯在马车上发现了一位自称贤狼的少女，两人结伴北上。'.repeat(40)

async function toggle(label: string) {
  await vi.waitFor(() => {
    if (document.querySelector('button')?.textContent?.trim() !== label)
      throw new Error('toggle not ready')
    const content = document.querySelector<HTMLElement>('.hn-line-clamp')!
    if (content.hasAttribute('data-animating') || content.style.maxHeight)
      throw new Error('still animating')
  })
  await frames()
}

export default defineLiveCases('LineClamp', [
  {
    name: 'overflowing content shows the expand button',
    vue: () => h(VLineClamp, null, () => long),
    react: () => <LineClamp>{long}</LineClamp>,
    settle: () => toggle('展开全部'),
  },
  {
    name: 'expanded after a click',
    vue: () => h(VLineClamp, null, () => long),
    react: () => <LineClamp>{long}</LineClamp>,
    interact: async container => {
      await toggle('展开全部')
      container.querySelector('button')!.click()
    },
    settle: () => toggle('收起'),
  },
  {
    name: 'short content has no button',
    vue: () => h(VLineClamp, null, () => '只有一行。'),
    react: () => <LineClamp>只有一行。</LineClamp>,
    settle: () => frames(),
  },
])
