import { describe, expect, it } from 'vitest'
import { Mark } from './Mark'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

describe('Mark', () => {
  it('warning 淡洗底 · 文字色继承不被 UA 黄底黑字接管', async () => {
    const host = await mount(
      <div style={{ color: 'rgb(23, 23, 23)' }}>
        <Mark>命中词</Mark>
      </div>,
    )
    const el = host.element.firstElementChild as HTMLElement
    const style = getComputedStyle(el)

    expect(el.tagName).toBe('MARK')
    expect(style.color).toBe('rgb(23, 23, 23)')
    expect(style.backgroundColor).not.toBe('rgb(255, 255, 0)')
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  })
})
