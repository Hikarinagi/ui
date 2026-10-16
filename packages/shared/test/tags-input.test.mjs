import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  addTagsInputValue,
  matchesTagsInputDelimiter,
  removeTagsInputValue,
  splitTagsInputPaste,
  tagsInputKeydown,
  tagsInputValueIndex,
} from '../src/primitives/tags-input/index.ts'

const options = { duplicate: false, max: 0, defaultValue: [] }
const key = key => ({ key, preventDefault() {} })
const tag = name => ({ name, hasAttribute: () => false })

test('adding appends new text, rejects duplicates and stops at max', () => {
  assert.deepEqual(addTagsInputValue(['a'], 'b', options), {
    added: true,
    value: ['a', 'b'],
    payload: 'b',
  })
  assert.deepEqual(addTagsInputValue(['a'], 'a', options), {
    added: false,
    payload: 'a',
    duplicate: true,
  })
  assert.deepEqual(addTagsInputValue(['a'], 'a', { ...options, duplicate: true }).value, ['a', 'a'])
  assert.deepEqual(addTagsInputValue(['a', 'b'], 'c', { ...options, max: 2 }), {
    added: false,
    payload: 'c',
    duplicate: false,
  })
  assert.deepEqual(addTagsInputValue(null, 'a', options).value, ['a'])
})

test('object values need convertValue and are compared by content when removed', () => {
  assert.throws(() => addTagsInputValue([{ id: 1 }], 'x', options), /convertValue/)
  const added = addTagsInputValue([{ id: 1 }], '2', { ...options, convertValue: id => ({ id }) })
  assert.deepEqual(added.value, [{ id: 1 }, { id: '2' }])
  assert.equal(tagsInputValueIndex(added.value, { id: '2' }), 1)
  assert.deepEqual(removeTagsInputValue(['a', 'b', 'c'], 1), ['a', 'c'])
})

test('Backspace at the start selects the last tag, then removes it and moves the selection', () => {
  const [a, b, c] = [tag('a'), tag('b'), tag('c')]
  const items = [a, b, c]
  const state = { caretAtStart: true, items, selected: undefined, dir: 'ltr' }
  assert.deepEqual(tagsInputKeydown(key('Backspace'), state), {
    select: { element: c },
    preventDefault: true,
  })
  assert.deepEqual(tagsInputKeydown(key('Backspace'), { ...state, selected: c }), {
    remove: c,
    select: { element: b },
    preventDefault: true,
  })
  assert.deepEqual(tagsInputKeydown(key('Delete'), { ...state, selected: a }), {
    remove: a,
    select: { element: b },
    preventDefault: true,
  })
  assert.equal(tagsInputKeydown(key('Delete'), state), undefined)
  assert.equal(tagsInputKeydown(key('Backspace'), { ...state, caretAtStart: false }), undefined)
  assert.equal(tagsInputKeydown(key('Backspace'), { ...state, items: [] }), undefined)
})

test('arrows walk the tags by reading direction and leave them past the last one', () => {
  const [a, b, c] = [tag('a'), tag('b'), tag('c')]
  const state = { caretAtStart: true, items: [a, b, c], selected: undefined, dir: 'ltr' }
  assert.equal(tagsInputKeydown(key('ArrowLeft'), state).select.element, c)
  assert.equal(tagsInputKeydown(key('ArrowLeft'), { ...state, selected: c }).select.element, b)
  assert.equal(tagsInputKeydown(key('ArrowRight'), { ...state, selected: b }).select.element, c)
  assert.deepEqual(tagsInputKeydown(key('ArrowRight'), { ...state, selected: c }).select, {
    element: undefined,
  })
  assert.equal(tagsInputKeydown(key('Home'), { ...state, selected: c }).select.element, a)
  assert.equal(
    tagsInputKeydown(key('ArrowRight'), { ...state, dir: 'rtl', selected: c }).select.element,
    b,
  )
  assert.equal(tagsInputKeydown(key('ArrowRight'), state), undefined)
  assert.deepEqual(tagsInputKeydown(key('ArrowUp'), { ...state, selected: a }), {
    preventDefault: true,
  })
  assert.deepEqual(tagsInputKeydown(key('x'), { ...state, selected: a }), {
    select: { element: undefined },
    preventDefault: false,
  })
})

test('delimiters match a string or a pattern and split pasted text', () => {
  assert.equal(matchesTagsInputDelimiter(',', ','), true)
  assert.equal(matchesTagsInputDelimiter(/[,;]/, ';'), true)
  assert.equal(matchesTagsInputDelimiter(',', 'a'), false)
  assert.deepEqual(splitTagsInputPaste('a,b,c', ','), ['a', 'b', 'c'])
  assert.deepEqual(splitTagsInputPaste('a;b', /;/), ['a', 'b'])
  assert.deepEqual(splitTagsInputPaste('a,b', ''), ['a,b'])
})
