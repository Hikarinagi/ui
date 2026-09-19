import { test } from 'node:test'
import assert from 'node:assert/strict'
import { applyCompletion } from '../src/lib/completion.ts'

test('replaces the supplied range and preserves both sides', () => {
  assert.deepEqual(
    applyCompletion(
      { text: 'entry:http sta duration:>500ms', selectionStart: 14, selectionEnd: 14 },
      { range: [11, 14], text: 'status:', keepOpen: true },
    ),
    {
      text: 'entry:http status: duration:>500ms',
      selectionStart: 18,
      selectionEnd: 18,
    },
  )
})

test('uses native input UTF-16 offsets for selections and inserted unicode', () => {
  assert.deepEqual(
    applyCompletion(
      { text: '😀 草稿 末尾', selectionStart: 3, selectionEnd: 5 },
      { range: [3, 5], text: '已发布✨' },
    ),
    {
      text: '😀 已发布✨ 末尾',
      selectionStart: 7,
      selectionEnd: 7,
    },
  )
})

test('supports insertion and empty replacement without mutating the context', () => {
  const context = { text: 'ab', selectionStart: 1, selectionEnd: 1 }
  assert.equal(applyCompletion(context, { range: [1, 1], text: 'cd' }).text, 'acdb')
  assert.equal(applyCompletion(context, { range: [0, 2], text: '' }).text, '')
  assert.equal(context.text, 'ab')
})

test('rejects stale or invalid ranges instead of deleting unrelated text', () => {
  for (const range of [
    [-1, 0],
    [2, 1],
    [0, 4],
    [0.5, 1],
    [0, NaN],
  ]) {
    assert.throws(
      () =>
        applyCompletion({ text: 'abc', selectionStart: 0, selectionEnd: 0 }, { range, text: 'x' }),
      RangeError,
    )
  }
})
