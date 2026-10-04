import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { QRCode } from './QRCode'

it('renders a complete accessible code without browser globals or raw payload injection', () => {
  const html = renderToString(
    <QRCode value={'<script>alert("unsafe")</script>'} label="Share link" size={240} />,
  )
  expect(html).toContain('viewBox="0 0 ')
  expect(html).toMatch(/<path d="M[^\"]+/)
  expect(html).toContain('aria-label="Share link"')
  expect(html).toContain('--hn-qr-size:240px')
  expect(html).not.toContain('unsafe')
  expect(html).not.toContain('<canvas')
})
it.each(['loading', 'expired', 'scanned'] as const)(
  'renders inactive status %s without a scannable code',
  status => {
    const html = renderToString(<QRCode value="https://hinaui.dev" status={status} />)
    expect(html).toContain(`data-state="${status}"`)
    expect(html).not.toContain('shape-rendering="crispEdges"')
    expect(html).toContain('role="status"')
  },
)
