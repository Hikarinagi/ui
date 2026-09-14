import { describe, expect, it } from 'vitest'
import { filterTree } from './filterTree'

describe('filterTree', () => {
  const leaf = { value: 0, label: 'Leaf' }
  const parent = { value: 'p', label: 'Parent', children: [leaf, { value: 'x', label: 'Other' }] }
  const root = { value: 'r', label: 'Root', children: [parent] }
  const nodes = [root, { value: 'z', label: 'Unrelated' }]

  it('keeps matching ancestors and original node identities without mutating children', () => {
    const result = filterTree(nodes, node => node.label === 'Leaf')
    expect(result.items).toEqual([root])
    expect(result.items[0]).toBe(root)
    expect(result.children.get(root)).toEqual([parent])
    expect(result.children.get(parent)).toEqual([leaf])
    expect(result.children.get(parent)?.[0]).toBe(leaf)
    expect(result.expanded).toEqual(['p', 'r'])
    expect(parent.children).toHaveLength(2)
  })

  it('retains matching parents without unrelated descendants and handles no matches', () => {
    const result = filterTree(nodes, node => node.label === 'Parent')
    expect(result.children.get(root)).toEqual([parent])
    expect(result.children.has(parent)).toBe(false)
    expect(filterTree(nodes, () => false).items).toEqual([])
    expect(filterTree([], () => true).items).toEqual([])
  })
})
