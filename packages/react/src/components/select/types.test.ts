import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  flattenOptions,
  isOptionGroup,
  type SelectItems,
  type SelectOption,
  type SelectOptionGroup,
} from './types'

type Option = SelectOption<{ count: number; options: { nested: boolean } }>

describe('完整选项类型', () => {
  it('平铺与分组都保留原始对象及业务字段，options 元数据不被误认为分组', () => {
    const first: Option = { value: 0, label: 'Zero', count: 12, options: { nested: true } }
    const second: Option = { value: 'one', label: 'One', count: 24, options: { nested: false } }
    const group: SelectOptionGroup<Option> = { label: 'Group', options: [second] }
    const items: SelectItems<Option> = [first, group]
    expect(isOptionGroup(first)).toBe(false)
    expect(isOptionGroup(group)).toBe(true)
    const flat = flattenOptions(items)
    expectTypeOf(flat).toEqualTypeOf<Option[]>()
    expect(flat).toHaveLength(2)
    expect(flat[0]).toBe(first)
    expect(flat[1]).toBe(second)
    expect(flat.map(option => option.count)).toEqual([12, 24])
  })

  it('未传泛型的现有类型和空分组保持兼容', () => {
    const option: SelectOption = { value: 'old', label: 'Old' }
    const group: SelectOptionGroup = { label: 'Empty', options: [] }
    const items: SelectItems = [option, group]
    expect(flattenOptions(items)).toEqual([option])
    expect(flattenOptions([])).toEqual([])
  })
})
