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

  it('展开时根元素与内容都标出 data-expanded,按钮文案为「收起」', () => {
    const { root, content } = mount({ defaultExpanded: true })
    expect(root.getAttribute('data-expanded')).toBe('')
    expect(content.getAttribute('data-expanded')).toBe('')
    expect(root.querySelector('button')!.textContent?.trim()).toBe('收起')
  })

  it('按钮始终在 DOM 中,量不到溢出时在根元素标出 data-truncated=false,其余属性落在根元素', () => {
    const { root, content } = mount({ id: 'intro' })
    expect(root.id).toBe('intro')
    expect(root.getAttribute('data-truncated')).toBe('false')
    const button = root.querySelector('button')!
    expect(button.textContent?.trim()).toBe('展开全部')
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-controls')).toBe(content.id)
  })
})
