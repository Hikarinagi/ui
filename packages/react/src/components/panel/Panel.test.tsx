import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { Panel } from './Panel'

afterEach(cleanup)

const header = (container: HTMLElement) => container.querySelector('[data-hn-panel] > div')!

describe('Panel', () => {
  it('没有正文时页眉自带底部内边距，有正文时由正文层负责', () => {
    const empty = render(<Panel title="空面板" />).container
    expect(empty.querySelectorAll('[data-hn-panel] > div')).toHaveLength(1)
    expect(header(empty).classList.contains('pb-(--hn-panel-p)')).toBe(true)

    const filled = render(
      <Panel title="有正文">
        <p>正文</p>
      </Panel>,
    ).container
    expect(header(filled).classList.contains('pb-(--hn-panel-p)')).toBe(false)
    const body = filled.querySelector('[data-hn-panel] > div:last-child')!
    expect(body.classList.contains('pb-(--hn-panel-p)')).toBe(true)
  })
})
