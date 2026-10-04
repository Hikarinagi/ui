import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { Avatar, type AvatarProps } from './Avatar'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> }> = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

async function mountAvatar(props: AvatarProps = {}) {
  const w = await mount(<Avatar {...props} />)
  mounted.push(w)
  return w
}

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='

describe('avatar · 头像', () => {
  it('三档都是正圆,尺寸 24 / 32 / 40', async () => {
    for (const [size, px] of [
      ['sm', 24],
      ['md', 32],
      ['lg', 40],
    ] as const) {
      const el = (await mountAvatar({ size })).element
      expect(el.offsetWidth).toBe(px)
      expect(el.offsetHeight).toBe(px)
      expect(parseFloat(getComputedStyle(el).borderTopLeftRadius)).toBeGreaterThanOrEqual(px / 2)
    }
  })

  it('图片加载成功后顶掉回退内容', async () => {
    const w = await mountAvatar({ src: PIXEL, name: '星见书音' })
    await vi.waitFor(() => {
      const img = w.element.querySelector('img')
      expect(img).toBeTruthy()
      expect(img!.getAttribute('src')).toBe(PIXEL)
    })
    await vi.waitFor(() => expect(w.element.textContent).not.toContain('星'))
  })

  it('图片加载失败时回落到首字母,坏图被移除', async () => {
    const w = await mountAvatar({ src: 'data:image/png;base64,bm90LWFuLWltYWdl', name: '星见书音' })
    await vi.waitFor(() => expect(w.element.textContent).toBe('星'))
    expect(w.element.querySelector('img')).toBeNull()
  })

  it('alt 缺省时取 name,图片不裁变形', async () => {
    const w = await mountAvatar({ src: PIXEL, name: 'Shion Hoshimi' })
    await vi.waitFor(() => expect(w.element.querySelector('img')).toBeTruthy())
    const img = w.element.querySelector('img')!
    expect(img.getAttribute('alt')).toBe('Shion Hoshimi')
    expect(getComputedStyle(img).objectFit).toBe('cover')
  })
})
