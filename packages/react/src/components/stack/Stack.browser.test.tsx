import type { ReactNode } from 'react'
import { describe, expect, it, beforeEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { Stack } from './Stack'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

async function mountIn(host: HTMLElement, ui: ReactNode) {
  const container = host.appendChild(document.createElement('div'))
  await render(ui, { container })
  return { element: container.firstElementChild as HTMLElement }
}

describe('stack 默认间距随密度翻转', () => {
  it('comfortable 16px,compact 12px —— 吃的是 --hn-stack-gap,不是写死的档', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const w = await mountIn(
      host,
      <Stack>
        <p>甲</p>
        <p>乙</p>
      </Stack>,
    )

    expect(getComputedStyle(w.element).rowGap).toBe('16px')

    host.setAttribute('data-density', 'compact')
    expect(getComputedStyle(w.element).rowGap).toBe('12px')

    const fixed = await mountIn(
      host,
      <Stack gap="sm">
        <p>甲</p>
      </Stack>,
    )
    expect(getComputedStyle(fixed.element).rowGap).toBe('8px')
  })
})
