import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  cleanPinText,
  editPinValue,
  movePinSelection,
  pinCells,
  pinInputValue,
  pinSelectionAt,
} from '../src/primitives/pin-input/index.ts'

const edit = (base, raw, selection, options = {}) =>
  editPinValue(
    base,
    raw,
    selection && { start: selection[0], end: selection[1] },
    options.length ?? 6,
    options.numeric ?? false,
    options.type,
  )

test('cleaning folds full-width characters and drops what a cell cannot hold', () => {
  assert.equal(cleanPinText(' a b\tc\n', false), 'abc')
  assert.equal(cleanPinText('ＡＢ１２', false), 'AB12')
  assert.equal(cleanPinText('你好　a​😀', false), '你好a')
  assert.equal(cleanPinText('验证码 １２-345 6', true), '123456')
  assert.equal(cleanPinText('abc', true), '')
  assert.equal(pinInputValue('1234567', 4), '1234')
  assert.equal(pinInputValue('12', -1), '')
})

test('the selection sits on a filled cell, on the first empty cell, or on the last cell when full', () => {
  assert.deepEqual(pinSelectionAt(0, 0, 6), [0, 0])
  assert.deepEqual(pinSelectionAt(2, 4, 6), [2, 3])
  assert.deepEqual(pinSelectionAt(4, 4, 6), [4, 4])
  assert.deepEqual(pinSelectionAt(9, 4, 6), [4, 4])
  assert.deepEqual(pinSelectionAt(6, 6, 6), [5, 6])
  assert.deepEqual(pinSelectionAt(2, 4, 6, true), [1, 2])
  assert.deepEqual(pinSelectionAt(0, 4, 6, true), [0, 1])
})

test('typing appends at the end and overwrites a selected cell', () => {
  assert.deepEqual(edit('12', '123', [2, 2]), { value: '123', start: 3, end: 3 })
  assert.deepEqual(edit('123456', '12x456', [2, 3]), { value: '12x456', start: 3, end: 4 })
  assert.deepEqual(edit('123456', '123456', [2, 3]), { value: '123456', start: 3, end: 4 })
  assert.deepEqual(edit('123456', '12345x', [5, 6]), { value: '12345x', start: 5, end: 6 })
  assert.deepEqual(edit('12345', '123456', [5, 5]), { value: '123456', start: 5, end: 6 })
  assert.deepEqual(edit('123456', '7', [0, 6]), { value: '7', start: 1, end: 1 })
})

test('a longer insertion overwrites the following cells instead of pushing them out', () => {
  assert.deepEqual(edit('123456', '12ab456', [2, 3]), { value: '12ab56', start: 4, end: 5 })
  assert.deepEqual(edit('123456', '12abcdefgh456', [2, 3]), {
    value: 'abcdef',
    start: 5,
    end: 6,
  })
  assert.deepEqual(edit('1234', '1234 98 7 ', [4, 4]), { value: '123498', start: 5, end: 6 })
  assert.deepEqual(edit('112', '1112', [0, 1]), { value: '112', start: 2, end: 3 })
  assert.deepEqual(edit('12', '654321', null), { value: '654321', start: 5, end: 6 })
  assert.deepEqual(edit('65', '654321', null), { value: '654321', start: 5, end: 6 })
})

test('rejected text leaves the value and the selection alone', () => {
  assert.deepEqual(edit('12', '12ni', [2, 2], { numeric: true }), {
    value: '12',
    start: 2,
    end: 2,
  })
  assert.deepEqual(edit('123456', '12你456', [2, 3], { numeric: true }), {
    value: '123456',
    start: 2,
    end: 3,
  })
  assert.deepEqual(edit('12', '12a7', [2, 2], { numeric: true }), {
    value: '127',
    start: 3,
    end: 3,
  })
})

test('deleting shifts the rest left and keeps deleting towards the start', () => {
  assert.deepEqual(edit('1234', '123', [4, 4], { type: 'deleteContentBackward' }), {
    value: '123',
    start: 3,
    end: 3,
  })
  assert.deepEqual(edit('123456', '12456', [2, 3], { type: 'deleteContentBackward' }), {
    value: '12456',
    start: 1,
    end: 2,
  })
  assert.deepEqual(edit('123456', '12456', [2, 3], { type: 'deleteContentForward' }), {
    value: '12456',
    start: 2,
    end: 3,
  })
  assert.deepEqual(edit('123456', '', [0, 6], { type: 'deleteContentBackward' }), {
    value: '',
    start: 0,
    end: 0,
  })
})

test('arrow movement walks filled cells and the first empty one, and extends with shift', () => {
  const move = (start, end, backward, size, target, extend = false) =>
    movePinSelection({ start, end }, backward, size, 6, target, extend)
  assert.deepEqual(move(4, 4, false, 4, 'previous'), { start: 3, end: 4, backward: false })
  assert.deepEqual(move(3, 4, false, 4, 'next'), { start: 4, end: 4, backward: false })
  assert.deepEqual(move(4, 4, false, 4, 'next'), { start: 4, end: 4, backward: false })
  assert.deepEqual(move(0, 1, false, 4, 'previous'), { start: 0, end: 1, backward: false })
  assert.deepEqual(move(5, 6, false, 6, 'next'), { start: 5, end: 6, backward: false })
  assert.deepEqual(move(2, 3, false, 6, 0), { start: 0, end: 1, backward: false })
  assert.deepEqual(move(2, 3, false, 6, 6), { start: 5, end: 6, backward: false })
  assert.deepEqual(move(0, 6, false, 6, 'previous'), { start: 0, end: 1, backward: false })
  assert.deepEqual(move(0, 4, false, 4, 'next'), { start: 4, end: 4, backward: false })
  assert.deepEqual(move(4, 4, false, 4, 'previous', true), { start: 3, end: 4, backward: true })
  assert.deepEqual(move(3, 4, true, 4, 'previous', true), { start: 2, end: 4, backward: true })
  assert.deepEqual(move(2, 4, true, 4, 'next', true), { start: 3, end: 4, backward: false })
  assert.deepEqual(move(1, 2, false, 4, 'next', true), { start: 1, end: 3, backward: false })
  assert.deepEqual(move(3, 4, false, 4, 0, true), { start: 0, end: 4, backward: true })
})

test('cells mirror the value and the selection', () => {
  const idle = { focused: false, start: 0, end: 0 }
  assert.deepEqual(pinCells('12', 3, idle), [
    { char: '1', active: false, caret: false },
    { char: '2', active: false, caret: false },
    { char: '', active: false, caret: false },
  ])
  assert.deepEqual(
    pinCells('12', 3, { focused: true, start: 2, end: 2 }).map(cell => [cell.active, cell.caret]),
    [
      [false, false],
      [false, false],
      [true, true],
    ],
  )
  assert.deepEqual(
    pinCells('123', 3, { focused: true, start: 0, end: 2 }).map(cell => cell.active),
    [true, true, false],
  )
})
