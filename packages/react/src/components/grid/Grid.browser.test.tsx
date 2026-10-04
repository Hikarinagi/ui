import { beforeEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Grid } from './Grid'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('grid 的 md 档双轴各吃各的密度 token', () => {
  it('列间 inline-gap、行间 stack-gap,compact 同步收紧', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    await render(
      <Grid cols={2}>
        <p>甲</p>
        <p>乙</p>
        <p>丙</p>
        <p>丁</p>
      </Grid>,
      { container: host },
    )
    const element = host.firstElementChild as HTMLElement

    expect(getComputedStyle(element).columnGap).toBe('12px')
    expect(getComputedStyle(element).rowGap).toBe('16px')

    host.setAttribute('data-density', 'compact')
    expect(getComputedStyle(element).columnGap).toBe('8px')
    expect(getComputedStyle(element).rowGap).toBe('12px')
  })
})
