import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { LineClamp, type LineClampProps } from './LineClamp'

afterEach(cleanup)

function mount(props: LineClampProps = {}) {
  const root = render(<LineClamp {...props}>简介</LineClamp>).container
    .firstElementChild as HTMLElement
  return { root, content: root.firstElementChild as HTMLElement }
}

describe('LineClamp', () => {
  it('渲染 children,默认折叠到 3 行,className 追加到根元素', () => {
    const { root, content } = mount({ className: 'max-w-md' })
    expect(root.classList.contains('max-w-md')).toBe(true)
    expect(content.textContent).toBe('简介')
    expect(content.style.getPropertyValue('--hn-line-clamp')).toBe('3')
    expect(content.classList.contains('hn-line-clamp')).toBe(true)
    expect(content.hasAttribute('data-expanded')).toBe(false)
  })

  it('lines 向下取整且不小于 1,非法值回退到 3', () => {
    const value = (lines: number) =>
      mount({ lines }).content.style.getPropertyValue('--hn-line-clamp')
    expect(value(5)).toBe('5')
    expect(value(2.8)).toBe('2')
    expect(value(0)).toBe('1')
    expect(value(Number.NaN)).toBe('3')
  })

  it('展开时标出 data-expanded,量到溢出之前不带 data-truncated', () => {
    const { content } = mount({ defaultExpanded: true })
    expect(content.getAttribute('data-expanded')).toBe('')
    expect(content.hasAttribute('data-truncated')).toBe(false)
    expect(content.style.getPropertyValue('--hn-line-clamp-size')).toBe('')
  })

  it('量不到溢出时不渲染按钮,其余属性落在根元素', () => {
    const { root } = mount({ id: 'intro' })
    expect(root.id).toBe('intro')
    expect(root.querySelector('button')).toBeNull()
  })
})
