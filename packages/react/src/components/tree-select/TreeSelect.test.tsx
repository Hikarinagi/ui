import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { TreeSelect, type TreeSelectProps } from './TreeSelect'
import { findNode, pathTo } from './types'
import { signal } from '../../../test/signal'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const items = [
  {
    value: 'jp',
    label: '日本',
    children: [
      { value: 'tokyo', label: '东京', children: [{ value: 'shibuya', label: '涩谷' }] },
      { value: 'osaka', label: '大阪' },
    ],
  },
  { value: 'cn', label: '中国', children: [{ value: 'shanghai', label: '上海', disabled: true }] },
]

function mount(ui: ReactNode) {
  return render(ui).container
}

const triggerOf = (element: Element) =>
  element.querySelector('[data-hn-tree-select]') as HTMLButtonElement

describe('触发器', () => {
  it('触发器就是输入面宿主，role=combobox，无值显示占位并标 data-placeholder，有值显示节点文字', async () => {
    const props = signal<Partial<TreeSelectProps>>({})
    function Harness() {
      return <TreeSelect items={items} aria-label="地区" {...props.use()} />
    }
    const w = mount(<Harness />)
    const trigger = triggerOf(w)
    expect(trigger.getAttribute('role')).toBe('combobox')
    expect(trigger.getAttribute('aria-label')).toBe('地区')
    expect(trigger.classList.contains('hn-field')).toBe(true)
    expect(trigger.classList.contains('group/hn-disclosure')).toBe(true)
    expect(trigger.textContent).toBe('请选择')
    expect(trigger.getAttribute('data-placeholder')).toBe('')
    await act(() => {
      props.value = { value: 'shibuya', placeholder: '选择地区' }
    })
    expect(triggerOf(w).textContent).toBe('涩谷')
    expect(triggerOf(w).getAttribute('data-placeholder')).toBeNull()
  })

  it('双形态与档位类与 Input 同源；invalid 与 disabled 落到触发器', () => {
    expect([...triggerOf(mount(<TreeSelect items={items} />)).classList]).toContain(
      '[--hn-field-shadow:var(--hn-shadow-sm)]',
    )
    expect([
      ...triggerOf(mount(<TreeSelect items={items} variant="secondary" />)).classList,
    ]).toContain('border-transparent')
    expect(
      [...triggerOf(mount(<TreeSelect items={items} size="lg" />)).classList].join(' '),
    ).toContain('control-h-lg')
    const invalid = triggerOf(mount(<TreeSelect items={items} invalid />))
    expect(invalid.getAttribute('data-invalid')).toBe('')
    expect(invalid.getAttribute('aria-invalid')).toBe('true')
    expect(triggerOf(mount(<TreeSelect items={items} disabled />)).disabled).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(<TreeSelect items={items} value="osaka" aria-label="地区" />)
    await expectNoA11yViolations(w.firstElementChild!)
  })
})

describe('树数据', () => {
  it('按值找节点，求到根的路径', () => {
    expect(findNode(items, 'shibuya')?.label).toBe('涩谷')
    expect(findNode(items, 'nope')).toBeUndefined()
    expect(pathTo(items, 'shibuya')).toEqual(['jp', 'tokyo'])
    expect(pathTo(items, 'jp')).toEqual([])
    expect(pathTo(items, 'nope')).toBeNull()
  })
})
