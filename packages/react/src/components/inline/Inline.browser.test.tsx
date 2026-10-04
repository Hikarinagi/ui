import type { ReactNode } from 'react'
import { describe, expect, it, beforeEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { Inline } from './Inline'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

async function mountIn(host: HTMLElement, ui: ReactNode) {
  const container = host.appendChild(document.createElement('div'))
  await render(ui, { container })
  return { element: container.firstElementChild as HTMLElement }
}

describe('inline 默认间距随密度翻转', () => {
  it('comfortable 12px,compact 8px —— 吃的是 --hn-inline-gap', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const w = await mountIn(
      host,
      <Inline>
        <span>甲</span>
        <span>乙</span>
      </Inline>,
    )

    expect(getComputedStyle(w.element).columnGap).toBe('12px')

    host.setAttribute('data-density', 'compact')
    expect(getComputedStyle(w.element).columnGap).toBe('8px')
  })
})
