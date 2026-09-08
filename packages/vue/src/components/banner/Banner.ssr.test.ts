// @vitest-environment node
import { expect, test } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Banner from './Banner.vue'

function timers() {
  return process.getActiveResourcesInfo().filter(resource => resource === 'Timeout').length
}

// A timer started during SSR is never disposed, and it keeps the prerender
// process alive long after the pages are written.
test('an autoplaying banner starts no timer while rendering on the server', async () => {
  const before = timers()

  const app = createSSRApp({
    render: () =>
      h(
        Banner,
        { items: [{ text: 'one' }, { text: 'two' }], autoplay: 4000 },
        { item: ({ item }: { item: { text: string } }) => item.text },
      ),
  })
  const html = await renderToString(app)

  expect(html).toContain('data-hn-banner')
  expect(timers()).toBe(before)
})
