import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { TagsInput, type TagsInputProps } from './TagsInput'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const chips = (root: Element) => [...root.querySelectorAll('[data-hn-chip]')]
const field = (root: Element) => root.querySelector('input[type="text"]') as HTMLInputElement

function harness(initial: string[], props: Partial<TagsInputProps> = {}) {
  const updates: string[][] = []
  const invalid: string[] = []
  let cleared = 0
  function Harness(extra: Partial<TagsInputProps>) {
    const [value, setValue] = useState(initial)
    return (
      <TagsInput
        {...props}
        {...extra}
        value={value}
        onValueChange={next => {
          updates.push(next)
          setValue(next)
        }}
        onInvalid={tag => invalid.push(tag)}
        onClear={() => cleared++}
      />
    )
  }
  const screen = render(<Harness />)
  return {
    ...screen,
    root: screen.container,
    updates,
    invalid,
    cleared: () => cleared,
    update: (extra: Partial<TagsInputProps>) => screen.rerender(<Harness {...extra} />),
  }
}

async function enter(input: HTMLInputElement, text: string) {
  input.value = text
  await act(async () => {
    fireEvent.keyDown(input, { key: 'Enter' })
    await Promise.resolve()
    await Promise.resolve()
  })
}

describe('结构', () => {
  it('根是输入面宿主，class 落根、attrs 落文本输入；每个值一枚可移除的 Chip', () => {
    const { container } = render(
      <TagsInput
        value={['galgame', '轻小说']}
        placeholder="添加标签"
        className="mt-2"
        aria-label="标签"
      />,
    )
    const root = container.querySelector('[data-hn-tags-input]')!
    expect([...root.classList]).toContain('hn-field')
    expect([...container.querySelector('[data-hn-tags-input] > div')!.classList]).toContain(
      'flex-wrap',
    )
    expect([...root.classList]).toContain('mt-2')
    expect(field(container).getAttribute('aria-label')).toBe('标签')
    expect(field(container).getAttribute('placeholder')).toBe('添加标签')
    expect(chips(container).map(chip => chip.textContent)).toEqual(['galgame', '轻小说'])
    expect(chips(container).every(chip => chip.querySelector('button') !== null)).toBe(true)
  })

  it('尺寸落到宿主、输入区与 Chip；disabled 与 invalid 各落其位；name 渲染隐藏输入', () => {
    const { container } = render(<TagsInput value={['a']} size="sm" disabled invalid name="tags" />)
    const root = container.querySelector('[data-hn-tags-input]')!
    expect([...root.classList]).toContain('py-[calc((0.25rem-2px)/2)]')
    expect([...root.classList]).toContain('h-auto')
    expect([...root.classList]).toContain('min-h-[var(--hn-input-h)]')
    expect([...root.classList]).toContain('[--hn-input-h:var(--hn-control-h-sm)]')
    expect(root.getAttribute('data-invalid')).toBe('')
    expect(field(container).getAttribute('disabled')).not.toBeNull()
    expect(field(container).getAttribute('aria-invalid')).toBe('true')
    expect([...chips(container)[0]!.classList]).toContain(
      'h-[calc(var(--hn-control-h-sm)-0.25rem)]',
    )
    const form = render(
      <form>
        <TagsInput value={['a']} name="tags" />
      </form>,
    )
    expect(form.container.querySelector('input[name="tags[0]"]')).not.toBeNull()
  })
})

describe('交互', () => {
  it('Enter 把输入内容加成标签并清空输入；点 Chip 的移除钮删掉它', async () => {
    const { root, updates } = harness(['a'])
    const input = field(root)
    await enter(input, 'b')
    expect(updates[0]).toEqual(['a', 'b'])
    expect(input.value).toBe('')

    fireEvent.click(chips(root)[0]!.querySelector('button')!)
    expect(updates[1]).toEqual(['b'])
  })

  it('达到 max 或者重复时不加入并发 invalid', async () => {
    const { root, updates, invalid, update } = harness(['a'], { max: 1 })
    const input = field(root)
    await enter(input, 'b')
    expect(updates).toHaveLength(0)
    expect(invalid[0]).toEqual('b')

    update({ max: 0 })
    await enter(input, 'a')
    expect(updates).toHaveLength(0)
    expect(invalid[1]).toEqual('a')
  })

  it('clearable 时有值才显示清除钮，点它清空并发 clear', async () => {
    const { root, updates, cleared } = harness(['a', 'b'], { clearable: true })
    expect(root.querySelector('[data-hn-tags-input-clear]')).not.toBeNull()
    fireEvent.click(root.querySelector('[data-hn-tags-input-clear] button')!)
    expect(updates[0]).toEqual([])
    expect(cleared()).toBe(1)
    await vi.waitFor(() => expect(root.querySelector('[data-hn-tags-input-clear]')).toBeNull())
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const { container } = render(<TagsInput value={['galgame', '轻小说']} aria-label="标签" />)
    await expectNoA11yViolations(container.firstElementChild!)
  })
})
