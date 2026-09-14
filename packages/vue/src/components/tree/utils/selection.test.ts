import { describe, expect, it } from 'vitest'
import { checkedState, indexTree, toggleChecked } from './selection'
import type { TreeNode, TreeValue } from '../types'

const items: TreeNode[] = [
  {
    value: 'root',
    label: 'Root',
    children: [
      {
        value: 'branch',
        label: 'Branch',
        children: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ],
      },
      { value: 'c', label: 'Gamma' },
    ],
  },
]
const tree = indexTree(items)
const keys = (values: TreeValue[]) =>
  [...tree.entries.keys()].filter(key => checkedState(tree, values).get(key)?.selected)

describe('Tree check conduction', () => {
  it('marks every ancestor mixed when only one descendant is checked', () => {
    const state = checkedState(tree, ['a'])
    expect(state.get('a')?.selected).toBe(true)
    expect(state.get('branch')).toMatchObject({ selected: false, indeterminate: true })
    expect(state.get('root')).toMatchObject({ selected: false, indeterminate: true })
    expect(state.get('b')).toMatchObject({ selected: false, indeterminate: false })
  })
  it('derives fully checked parents from all available children', () => {
    expect(keys(['a', 'b'])).toEqual(['branch', 'a', 'b'])
    expect(keys(['a', 'b', 'c'])).toEqual(['root', 'branch', 'a', 'b', 'c'])
    expect(keys(['root'])).toEqual(['root', 'branch', 'a', 'b', 'c'])
  })
  it('checks all descendants from a mixed parent and clears them on the next click', () => {
    const all = toggleChecked(tree, ['a'], 'root')
    expect(all).toEqual(['root', 'branch', 'a', 'b', 'c'])
    expect(toggleChecked(tree, all, 'root')).toEqual([])
  })
  it('unchecking a descendant removes full parent keys without losing siblings', () => {
    const next = toggleChecked(tree, ['root'], 'a')
    expect(next).toEqual(['b', 'c'])
    expect(checkedState(tree, next).get('root')?.indeterminate).toBe(true)
    expect(toggleChecked(tree, next, 'a')).toEqual(['root', 'branch', 'a', 'b', 'c'])
  })
  it('unchecking a nested branch preserves selections outside that branch', () => {
    expect(toggleChecked(tree, ['root'], 'branch')).toEqual(['c'])
  })
  it('handles nested disabled subtrees as boundaries and preserves their bound values', () => {
    const tree = indexTree([
      {
        value: 'root',
        label: 'Root',
        children: [
          { value: 'a', label: 'Alpha' },
          {
            value: 'locked',
            label: 'Locked',
            disabled: true,
            children: [{ value: 'locked-child', label: 'Child' }],
          },
        ],
      },
    ])
    expect(toggleChecked(tree, [], 'root')).toEqual(['root', 'a'])
    expect(checkedState(tree, ['a']).get('root')).toMatchObject({
      selected: true,
      indeterminate: false,
    })
    expect(checkedState(tree, ['locked-child']).get('root')).toMatchObject({
      selected: false,
      indeterminate: false,
    })
    expect(checkedState(tree, ['locked-child']).get('locked-child')?.disabled).toBe(true)
    expect(toggleChecked(tree, ['locked-child'], 'root')).toEqual(['root', 'a', 'locked-child'])
    expect(toggleChecked(tree, ['root', 'locked-child'], 'root')).toEqual(['locked-child'])
    expect(toggleChecked(tree, ['a'], 'locked-child')).toEqual(['a'])
  })
  it('a parent with only disabled children can be checked without altering those children', () => {
    const tree = indexTree([
      {
        value: 'parent',
        label: 'Parent',
        children: [{ value: 'child', label: 'Child', disabled: true }],
      },
    ])
    expect(checkedState(tree, []).get('parent')?.selected).toBe(false)
    expect(toggleChecked(tree, [], 'parent')).toEqual(['parent'])
    expect(toggleChecked(tree, ['parent'], 'parent')).toEqual([])
  })
  it('distinguishes number and string keys, including zero and empty strings', () => {
    const tree = indexTree([
      {
        value: 0,
        label: 'Zero',
        children: [
          { value: 1, label: 'Number' },
          { value: '1', label: 'String' },
        ],
      },
      { value: '', label: 'Empty' },
    ])
    expect(toggleChecked(tree, [], 1)).toEqual([1])
    expect(toggleChecked(tree, [1], '1')).toEqual([0, 1, '1'])
    expect(toggleChecked(tree, [0], 1)).toEqual(['1'])
    expect(toggleChecked(tree, ['1'], '')).toEqual(['1', ''])
  })
  it('preserves unknown values and removes duplicates when emitting', () => {
    expect(toggleChecked(tree, ['missing', 'missing', 'a', 'a'], 'b')).toEqual([
      'missing',
      'branch',
      'a',
      'b',
    ])
    expect(toggleChecked(tree, ['a'], 'missing')).toEqual(['a'])
  })
  it('rebuilds states from current nodes after replacement, insertion or removal', () => {
    const updated = indexTree([
      {
        value: 'root',
        label: 'New root',
        children: [
          { value: 'a', label: 'A' },
          { value: 'new', label: 'New child' },
        ],
      },
    ])
    expect(checkedState(updated, ['a']).get('root')?.indeterminate).toBe(true)
    expect(checkedState(updated, ['root']).get('new')?.selected).toBe(true)
    expect(toggleChecked(updated, ['root'], 'new')).toEqual(['a'])
  })
  it('empty children behave like leaves and empty trees have no states', () => {
    const tree = indexTree([{ value: 'leaf', label: 'Leaf', children: [] }])
    expect(toggleChecked(tree, [], 'leaf')).toEqual(['leaf'])
    expect(checkedState(indexTree([]), []).size).toBe(0)
  })
  it('does not mutate input nodes or model arrays', () => {
    const before = structuredClone(items)
    const values = Object.freeze(['a'])
    toggleChecked(tree, values as unknown as TreeValue[], 'root')
    expect(items).toEqual(before)
    expect(values).toEqual(['a'])
  })
  it('each leaf toggles independently for every selection combination', () => {
    const leaves = ['a', 'b', 'c']
    for (let mask = 0; mask < 8; mask++) {
      const values = leaves.filter((_, i) => mask & (1 << i))
      for (const leaf of leaves) {
        const next = toggleChecked(tree, values, leaf)
        expect(leaves.filter(value => next.includes(value))).toEqual(
          leaves.filter(value =>
            value === leaf ? !values.includes(value) : values.includes(value),
          ),
        )
        expect(keys(toggleChecked(tree, next, leaf))).toEqual(keys(values))
        for (const state of checkedState(tree, next).values())
          expect(state.selected && state.indeterminate).toBe(false)
      }
    }
  })
})
