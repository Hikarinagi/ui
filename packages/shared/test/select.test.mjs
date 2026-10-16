import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  createSelectedItemTracker,
  selectNavigationCandidates,
  shouldShowPlaceholder,
  toggleSelectValue,
} from '../src/primitives/select/index.ts'

test('the placeholder shows for empty values only', () => {
  for (const value of [undefined, null, '', []]) assert.equal(shouldShowPlaceholder(value), true)
  for (const value of [0, false, 'a', ['a']]) assert.equal(shouldShowPlaceholder(value), false)
})

test('multiple selection toggles values by the comparator', () => {
  assert.deepEqual(toggleSelectValue(['a'], 'b'), ['a', 'b'])
  assert.deepEqual(toggleSelectValue(['a', 'b'], 'a'), ['b'])
  assert.deepEqual(toggleSelectValue(undefined, 'a'), ['a'])
  assert.deepEqual(toggleSelectValue([{ id: 1 }, { id: 2 }], { id: 1, label: 'x' }, 'id'), [
    { id: 2 },
  ])
})

test('navigation keys produce the focus candidates after the target', () => {
  const items = ['a', 'b', 'c', 'd']
  assert.deepEqual(selectNavigationCandidates(items, 'ArrowDown', 'b'), ['c', 'd'])
  assert.deepEqual(selectNavigationCandidates(items, 'ArrowUp', 'c'), ['b', 'a'])
  assert.deepEqual(selectNavigationCandidates(items, 'Home', 'c'), items)
  assert.deepEqual(selectNavigationCandidates(items, 'End', 'b'), ['d', 'c', 'b', 'a'])
  assert.equal(selectNavigationCandidates(items, 'Enter', 'b'), null)
})

test('the selected item is the first selected option, or the first enabled one', () => {
  const single = createSelectedItemTracker()
  assert.equal(single.item(false, true, false), false)
  assert.equal(single.item(false, false, false), true)
  assert.equal(single.item(false, false, false), false)
  assert.equal(single.item(true, false, false), true)

  const multiple = createSelectedItemTracker()
  assert.equal(multiple.item(false, false, true), true)
  assert.equal(multiple.item(true, false, true), true)
  assert.equal(multiple.item(true, false, true), false)

  const text = createSelectedItemTracker()
  assert.equal(text.text(false, false), true)
  text.item(false, false, false)
  assert.equal(text.text(false, false), false)
  assert.equal(text.text(true, false), true)
})
