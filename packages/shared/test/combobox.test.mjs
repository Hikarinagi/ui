import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createCollatorFilter } from '../src/lib/virtual/filter.ts'
import { comboboxSearchText, filterComboboxItems } from '../src/primitives/combobox/index.ts'

const { contains } = createCollatorFilter({ sensitivity: 'base' })

test('filtering scores items and keeps groups that still have a match', () => {
  const items = new Map([
    ['a', 'Apple'],
    ['b', 'Banana'],
    ['c', 'Cherry'],
  ])
  const groups = new Map([
    ['fruit', new Set(['a', 'b'])],
    ['berry', new Set(['c'])],
  ])
  const state = filterComboboxItems(items, groups, 'an', contains)
  assert.equal(state.count, 1)
  assert.deepEqual(
    [...state.items],
    [
      ['a', 0],
      ['b', 1],
      ['c', 0],
    ],
  )
  assert.deepEqual([...state.groups], ['fruit'])
  assert.equal(filterComboboxItems(items, groups, 'APP', contains).count, 1)
})

test('the search text follows the display value or a single primitive value', () => {
  assert.equal(comboboxSearchText('a', false), 'a')
  assert.equal(comboboxSearchText(3, false), '3')
  assert.equal(comboboxSearchText({ id: 1 }, false), '')
  assert.equal(comboboxSearchText(['a'], true), '')
  assert.equal(comboboxSearchText(undefined, false), '')
  assert.equal(
    comboboxSearchText({ label: 'x' }, false, value => value.label),
    'x',
  )
})
