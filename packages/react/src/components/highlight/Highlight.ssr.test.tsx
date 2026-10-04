import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Highlight } from './Highlight'

it.each(['x', 'y', 'both'] as const)('axis=%s 可在没有浏览器 API 时输出高亮', axis => {
  const html = renderToString(<Highlight axis={axis} as="li" className="absolute inset-0" />)

  expect(html).toContain('<li')
  expect(html).toContain('data-hn-highlight')
  expect(html).toContain('aria-hidden="true"')
  expect(html).toContain('absolute inset-0')
})
