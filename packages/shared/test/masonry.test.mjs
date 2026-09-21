import assert from 'node:assert/strict'
import { test } from 'node:test'
import { layoutMasonry, masonryColumns } from '../src/lib/masonry.ts'

test('shortest-column placement preserves ties and omits a trailing gap', () => {
  assert.deepEqual(layoutMasonry([100, 200, 60, 80, 30], 3, 12), {
    positions: [
      { column: 0, top: 0 },
      { column: 1, top: 0 },
      { column: 2, top: 0 },
      { column: 2, top: 72 },
      { column: 0, top: 112 },
    ],
    height: 200,
  })
})
test('sequential placement uses data order within each row', () => {
  assert.deepEqual(layoutMasonry([100, 200, 60, 80], 3, 12, true), {
    positions: [
      { column: 0, top: 0 },
      { column: 1, top: 0 },
      { column: 2, top: 0 },
      { column: 0, top: 112 },
    ],
    height: 200,
  })
})
test('auto columns are container based and never reach zero', () => {
  assert.equal(masonryColumns(752, 240, 16), 3)
  assert.equal(masonryColumns(751, 240, 16), 2)
  assert.equal(masonryColumns(120, 240, 16), 1)
  assert.equal(masonryColumns(120, 240, 16, 4.8), 4)
  assert.equal(masonryColumns(120, 240, 16, -1), 1)
  assert.equal(masonryColumns(752, NaN, 16, Infinity), 3)
})
test('empty and single-column layouts do not reserve phantom space', () => {
  assert.deepEqual(layoutMasonry([], 3, 12), { positions: [], height: 0 })
  assert.deepEqual(layoutMasonry([100, 200], 1, 12), {
    positions: [
      { column: 0, top: 0 },
      { column: 0, top: 112 },
    ],
    height: 312,
  })
})
