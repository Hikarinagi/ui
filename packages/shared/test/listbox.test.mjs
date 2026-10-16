import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  compare,
  enabledListboxItems,
  findValuesBetween,
  getNextMatch,
  ignoresListboxArrow,
  listboxContentTabIndex,
  listboxItemTabIndex,
  listboxNavigation,
  listboxRangeValues,
  nextListboxValue,
  valueComparator,
} from '../src/primitives/listbox/index.ts'

const item = (name, disabled = false) => ({ name, dataset: disabled ? { disabled: '' } : {} })
const keys = (key, modifiers = {}) => ({
  key,
  shiftKey: false,
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  ...modifiers,
})

test('values compare by identity for strings, by key or function, and deeply otherwise', () => {
  assert.equal(compare('a', 'a'), true)
  assert.equal(compare(undefined, undefined), false)
  assert.equal(compare({ id: 1, label: 'x' }, { id: 1, label: 'y' }, 'id'), true)
  assert.equal(
    compare({ id: 1 }, { id: 2 }, (a, b) => a.id + 1 === b.id),
    true,
  )
  assert.equal(compare({ a: [1, 2] }, { a: [1, 2] }), true)
  assert.equal(valueComparator(['a', 'b'], 'b'), true)
  assert.equal(valueComparator(undefined, 'b'), false)
})

test('single selection toggles off the selected value only with the toggle behavior', () => {
  const toggle = { multiple: false, selectionBehavior: 'toggle' }
  assert.deepEqual(nextListboxValue('a', 'a', toggle), { value: undefined, anchor: false })
  assert.deepEqual(nextListboxValue('a', 'b', toggle), { value: 'b', anchor: false })
  assert.deepEqual(nextListboxValue('a', 'a', { ...toggle, selectionBehavior: 'replace' }), {
    value: 'a',
    anchor: false,
  })
})

test('multiple selection toggles membership or replaces and anchors the range start', () => {
  const toggle = { multiple: true, selectionBehavior: 'toggle' }
  assert.deepEqual(nextListboxValue(['a'], 'b', toggle).value, ['a', 'b'])
  assert.deepEqual(nextListboxValue(['a', 'b'], 'a', toggle).value, ['b'])
  assert.deepEqual(nextListboxValue(undefined, 'a', toggle).value, ['a'])
  assert.deepEqual(nextListboxValue(['a', 'b'], 'c', { ...toggle, selectionBehavior: 'replace' }), {
    value: ['c'],
    anchor: true,
  })
})

test('navigation skips disabled items, moves from the highlight and starts at the edges', () => {
  const [a, b, c, d] = [item('a'), item('b', true), item('c'), item('d')]
  const items = enabledListboxItems([a, b, c, d])
  assert.deepEqual(items, [a, c, d])
  assert.equal(listboxNavigation(items, a, 'next').target, c)
  assert.equal(listboxNavigation(items, c, 'prev').target, a)
  assert.equal(listboxNavigation(items, d, 'next').target, undefined)
  assert.equal(listboxNavigation(items, c, 'first').target, a)
  assert.equal(listboxNavigation(items, a, 'last').target, d)
  assert.equal(listboxNavigation(items, null, 'prev').target, d)
  assert.equal(listboxNavigation(items, null, 'next').target, a)
  assert.deepEqual(listboxNavigation(items, a, 'next'), {
    target: c,
    rangeTarget: c,
    extendsRange: true,
  })
  assert.equal(listboxNavigation(items, null, 'next').extendsRange, false)
})

test('shift extends the range from the anchor, Home and End reach the edges', () => {
  const entries = ['a', 'b', 'c', 'd'].map(value => ({ ref: item(value, value === 'b'), value }))
  const ref = value => entries.find(entry => entry.value === value).ref
  assert.deepEqual(
    listboxRangeValues(keys('ArrowDown', { shiftKey: true }), entries, ref('d'), 'a'),
    ['a', 'c', 'd'],
  )
  assert.deepEqual(listboxRangeValues(keys('Home', { shiftKey: true }), entries, ref('a'), 'd'), [
    'a',
    'c',
    'd',
  ])
  assert.deepEqual(listboxRangeValues(keys('End', { shiftKey: true }), entries, ref('a'), 'c'), [
    'c',
    'd',
  ])
  assert.equal(listboxRangeValues(keys('ArrowDown'), entries, ref('d'), 'a'), undefined)
  assert.equal(
    listboxRangeValues(keys('ArrowDown', { metaKey: true }), entries, ref('d'), 'a'),
    undefined,
  )
  assert.equal(
    listboxRangeValues(keys('ArrowDown', { shiftKey: true }), entries, ref('d'), undefined),
    undefined,
  )
  assert.deepEqual(findValuesBetween(['a', 'b', 'c'], 'c', 'a'), ['a', 'b', 'c'])
})

test('tab stops follow focusability and the highlight', () => {
  assert.equal(listboxContentTabIndex(true, false), '0')
  assert.equal(listboxContentTabIndex(true, true), '-1')
  assert.equal(listboxContentTabIndex(false, false), '-1')
  assert.equal(listboxItemTabIndex(true, true), '0')
  assert.equal(listboxItemTabIndex(true, false), '-1')
  assert.equal(listboxItemTabIndex(false, true), -1)
})

test('cross-axis arrows are ignored for the orientation', () => {
  assert.equal(ignoresListboxArrow('ArrowLeft', 'vertical'), true)
  assert.equal(ignoresListboxArrow('ArrowDown', 'vertical'), false)
  assert.equal(ignoresListboxArrow('ArrowUp', 'horizontal'), true)
  assert.equal(ignoresListboxArrow('Home', 'horizontal'), false)
})

test('typeahead cycles through repeated characters and keeps a still matching item', () => {
  const values = ['Apple', 'Avocado', 'Banana', 'apricot']
  assert.equal(getNextMatch(values, 'a', 'Apple'), 'Avocado')
  assert.equal(getNextMatch(values, 'aa', 'Avocado'), 'apricot')
  assert.equal(getNextMatch(values, 'ap', 'Apple'), undefined)
  assert.equal(getNextMatch(values, 'b'), 'Banana')
  assert.equal(getNextMatch(values, 'z'), undefined)
})
