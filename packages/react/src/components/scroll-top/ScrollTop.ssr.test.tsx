import { expect, it, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import { ScrollTop } from './ScrollTop'

it('does not read a target getter or render a visible button during SSR', async () => {
  const target = vi.fn(() => {
    throw new Error('Client-only target')
  })
  const html = renderToString(<ScrollTop target={target} />)
  expect(target).not.toHaveBeenCalled()
  expect(html).not.toContain('<button')
})

it('safely defaults to the page without accessing window during SSR', async () => {
  const html = renderToString(<ScrollTop />)
  expect(html).not.toContain('<button')
})
