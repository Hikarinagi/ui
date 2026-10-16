import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  flattenTree,
  nextTreeSelection,
  toggleTreeExpanded,
  treeChildTarget,
  treeIndeterminate,
  treeParentTarget,
  treeRangeValues,
  treeSelectedKeys,
} from '../src/primitives/tree/index.ts'

const tree = [
  {
    id: 'a',
    children: [{ id: 'a1' }, { id: 'a2', children: [{ id: 'a2x' }] }],
  },
  { id: 'b' },
]
const accessors = { getKey: node => node.id, getChildren: node => node.children }
const byId = id => {
  const walk = nodes => {
    for (const node of nodes) {
      if (node.id === id) return node
      const found = node.children && walk(node.children)
      if (found) return found
    }
  }
  return walk(tree)
}
const ids = model => model.map(node => node.id)
const options = overrides => ({
  ...accessors,
  multiple: true,
  selectionBehavior: 'toggle',
  propagateSelect: false,
  bubbleSelect: false,
  flattened: flattenTree(tree, accessors, ['a', 'a2']),
  ...overrides,
})

test('flattening walks expanded branches only and records level, position and parent', () => {
  const collapsed = flattenTree(tree, accessors, [])
  assert.deepEqual(
    collapsed.map(item => item._id),
    ['a', 'b'],
  )
  const open = flattenTree(tree, accessors, ['a', 'a2'])
  assert.deepEqual(
    open.map(item => [item._id, item.level, item.bind['aria-posinset'], item.bind['aria-setsize']]),
    [
      ['a', 1, 1, 2],
      ['a1', 2, 1, 2],
      ['a2', 2, 2, 2],
      ['a2x', 3, 1, 1],
      ['b', 1, 2, 2],
    ],
  )
  assert.equal(open[3].parentItem, byId('a2'))
  assert.equal(open[0].hasChildren, true)
  assert.equal(open[1].hasChildren, false)
})

test('selected keys come from the array in multiple mode and from the single value otherwise', () => {
  assert.deepEqual(treeSelectedKeys([byId('a1'), byId('b')], true, accessors.getKey), ['a1', 'b'])
  assert.deepEqual(treeSelectedKeys(byId('b'), false, accessors.getKey), ['b'])
  assert.deepEqual(treeSelectedKeys(undefined, false, accessors.getKey), [undefined])
})

test('single selection copies the node, toggles it off, and replace keeps it selected', () => {
  const single = options({ multiple: false })
  const picked = nextTreeSelection(undefined, byId('b'), single).value
  assert.deepEqual(picked, byId('b'))
  assert.notEqual(picked, byId('b'))
  assert.equal(nextTreeSelection(byId('b'), byId('b'), single).value, undefined)
  assert.deepEqual(
    nextTreeSelection(byId('b'), byId('b'), { ...single, selectionBehavior: 'replace' }).value,
    byId('b'),
  )
})

test('multiple selection toggles membership, and replace anchors a new range', () => {
  assert.deepEqual(ids(nextTreeSelection([byId('b')], byId('a1'), options()).value), ['b', 'a1'])
  assert.deepEqual(ids(nextTreeSelection([byId('b'), byId('a1')], byId('b'), options()).value), [
    'a1',
  ])
  const replaced = nextTreeSelection(
    [byId('b')],
    byId('a1'),
    options({ selectionBehavior: 'replace' }),
  )
  assert.deepEqual(ids(replaced.value), ['a1'])
  assert.equal(replaced.anchor, true)
})

test('propagating a selection adds or removes every descendant', () => {
  const propagate = options({ propagateSelect: true })
  const added = nextTreeSelection([], byId('a'), propagate).value
  assert.deepEqual(ids(added), ['a', 'a1', 'a2', 'a2x'])
  assert.deepEqual(ids(nextTreeSelection(added, byId('a'), propagate).value), [])
})

test('bubbling selects a parent once all its children are selected and drops it otherwise', () => {
  const bubble = options({ bubbleSelect: true })
  const one = nextTreeSelection([], byId('a2x'), bubble).value
  assert.deepEqual(ids(one), ['a2x', 'a2'])
  const both = nextTreeSelection(one, byId('a1'), bubble).value
  assert.deepEqual(ids(both), ['a2x', 'a2', 'a1', 'a'])
  assert.deepEqual(ids(nextTreeSelection(both, byId('a2x'), bubble).value), ['a1'])
})

test('a branch is indeterminate while only some descendants are selected', () => {
  const base = {
    ...accessors,
    value: byId('a'),
    hasChildren: true,
    isSelected: false,
    bubbleSelect: true,
    propagateSelect: false,
  }
  assert.equal(treeIndeterminate({ ...base, model: [byId('a1')] }), true)
  assert.equal(treeIndeterminate({ ...base, model: [byId('a1'), byId('a2'), byId('a2x')] }), false)
  assert.equal(treeIndeterminate({ ...base, model: byId('a1') }), undefined)
  assert.equal(
    treeIndeterminate({
      ...base,
      bubbleSelect: false,
      propagateSelect: true,
      isSelected: true,
      model: [byId('a'), byId('a1')],
    }),
    true,
  )
})

test('expanding toggles the key in the expanded list', () => {
  assert.deepEqual(toggleTreeExpanded(['a'], 'b'), ['a', 'b'])
  assert.deepEqual(toggleTreeExpanded(['a', 'b'], 'a'), ['b'])
})

test('shift ranges run from the anchor to the focused item or the edges', () => {
  const values = ['a', 'b', 'c', 'd']
  const entries = values.map(value => ({ ref: { dataset: {} }, value }))
  const state = { firstValue: 'b', multiple: true, model: ['b'] }
  assert.deepEqual(treeRangeValues('next', entries[3].ref, entries, values, state), ['b', 'c', 'd'])
  assert.deepEqual(treeRangeValues('first', entries[3].ref, entries, values, state), ['a', 'b'])
  assert.deepEqual(treeRangeValues('last', entries[0].ref, entries, values, state), ['b', 'c', 'd'])
  assert.equal(
    treeRangeValues('next', entries[3].ref, entries, values, { ...state, firstValue: undefined }),
    undefined,
  )
  assert.equal(
    treeRangeValues('next', entries[3].ref, entries, values, { ...state, model: 'b' }),
    undefined,
  )
})

test('right and left arrows find the first child and the parent by indent', () => {
  const row = level => ({ getAttribute: () => String(level) })
  const rows = [row(1), row(2), row(3), row(2), row(1)]
  assert.equal(treeChildTarget(rows, rows[0], 1), rows[1])
  assert.equal(treeChildTarget(rows, rows[1], 2), rows[2])
  assert.equal(treeParentTarget(rows, rows[2], 3), rows[1])
  assert.equal(treeParentTarget(rows, rows[3], 2), rows[0])
  assert.equal(treeParentTarget(rows, rows[0], 1), undefined)
})
