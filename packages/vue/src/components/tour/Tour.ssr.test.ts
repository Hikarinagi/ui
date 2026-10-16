import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Tour from './Tour.vue'

const steps = [{ target: '#create', title: '新建', description: '从这里开始。' }]

describe('Tour on the server', () => {
  it('renders nothing until the client mounts, open or closed', async () => {
    for (const open of [false, true]) {
      const html = await renderToString(createSSRApp({ render: () => h(Tour, { steps, open }) }))
      expect(html.replace(/<!--[\s\S]*?-->/g, '')).toBe('')
    }
  })
})
