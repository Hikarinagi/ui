import type { ReactNode } from 'react'
import { describe, expect, it, beforeEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { Flex } from './Flex'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

async function mountIn(host: HTMLElement, ui: ReactNode) {
  const container = host.appendChild(document.createElement('div'))
  await render(ui, { container })
  return { element: container.firstElementChild as HTMLElement }
}

describe('flex 的 md 档随方向与密度双重决定', () => {
  it('row 取 inline-gap、col 取 stack-gap,compact 下同步收紧', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const kids = () => [<span key="a">甲</span>, <span key="b">乙</span>]
    const row = await mountIn(host, <Flex gap="md">{kids()}</Flex>)
    const col = await mountIn(
      host,
      <Flex gap="md" direction="col">
        {kids()}
      </Flex>,
    )

    expect(getComputedStyle(row.element).columnGap).toBe('12px')
    expect(getComputedStyle(col.element).rowGap).toBe('16px')

    host.setAttribute('data-density', 'compact')
    expect(getComputedStyle(row.element).columnGap).toBe('8px')
    expect(getComputedStyle(col.element).rowGap).toBe('12px')
  })
})
