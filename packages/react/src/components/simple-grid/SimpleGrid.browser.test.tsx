import { beforeEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { SimpleGrid } from './SimpleGrid'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function hostWidth(px: number) {
  const host = document.createElement('div')
  host.style.width = `${px}px`
  document.body.appendChild(host)
  return host
}

const kids = () => [<p key="甲">甲</p>, <p key="乙">乙</p>, <p key="丙">丙</p>]

describe('simple grid 按容器宽自动成列', () => {
  it('500px 容器 + 200px 最小列宽 = 2 列;auto-fit 时 3 个子项撑满', async () => {
    const filledHost = hostWidth(500)
    await render(<SimpleGrid min="200px">{kids()}</SimpleGrid>, { container: filledHost })
    const filled = filledHost.firstElementChild as HTMLElement
    const tracks = getComputedStyle(filled).gridTemplateColumns.split(' ')
    expect(tracks.length).toBe(2)

    const narrowHost = hostWidth(500)
    await render(<SimpleGrid min="100px">{kids()}</SimpleGrid>, { container: narrowHost })
    const narrow = narrowHost.firstElementChild as HTMLElement
    expect(getComputedStyle(narrow).gridTemplateColumns.split(' ').length).toBe(4)
  })
})
