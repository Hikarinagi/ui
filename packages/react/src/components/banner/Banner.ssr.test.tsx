import { expect, test } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Banner } from './Banner'

function timers() {
  return process.getActiveResourcesInfo().filter(resource => resource === 'Timeout').length
}

test('an autoplaying banner starts no timer while rendering on the server', () => {
  const before = timers()

  const html = renderToString(
    <Banner<{ text: string }>
      items={[{ text: 'one' }, { text: 'two' }]}
      autoplay={4000}
      renderItem={({ item }) => item.text}
    />,
  )

  expect(html).toContain('data-hn-banner')
  expect(timers()).toBe(before)
})
