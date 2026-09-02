import { describe, expect, it } from 'vitest'
import { fileNameOf } from './download'

describe('fileNameOf', () => {
  it('取地址路径的最后一段', () => {
    expect(fileNameOf('https://cdn.test/galgame/10012/dhh586sg_2.jpg?w=1200')).toBe(
      'dhh586sg_2.jpg',
    )
    expect(fileNameOf('/sample.webp')).toBe('sample.webp')
  })

  it('解码百分号编码的文件名', () => {
    expect(fileNameOf('https://cdn.test/%E5%B0%81%E9%9D%A2.webp')).toBe('封面.webp')
  })

  it('没有路径时用兜底名', () => {
    expect(fileNameOf('https://cdn.test/')).toBe('image')
    expect(fileNameOf('data:image/png;base64,AAAA', 'picture')).toBe('picture')
  })
})
