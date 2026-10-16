import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  getMotionAttribute,
  getViewportPosition,
  makeContentId,
  makeTriggerId,
} from '../src/primitives/navigation-menu/index.ts'

const triggers = ['a', 'b', 'c'].map(value => ({ id: makeTriggerId('menu', value) }))
const motion = (modelValue, previousValue, value, dir = 'ltr') =>
  getMotionAttribute({ triggers, dir, modelValue, previousValue, value })

test('trigger and content ids share the base id and value', () => {
  assert.equal(makeTriggerId('menu', 'a'), 'menu-trigger-a')
  assert.equal(makeContentId('menu', 'a'), 'menu-content-a')
})

test('the opening panel enters from the side of the previous panel', () => {
  assert.equal(motion('c', 'a', 'c'), 'from-end')
  assert.equal(motion('a', 'c', 'a'), 'from-start')
  assert.equal(motion('a', 'c', 'a', 'rtl'), 'from-end')
  assert.equal(motion('b', '', 'b'), null)
})

test('the closing panel leaves toward the next panel and others keep their attribute', () => {
  assert.equal(motion('c', 'a', 'a'), 'to-start')
  assert.equal(motion('a', 'c', 'c'), 'to-end')
  assert.equal(motion('', 'b', 'b'), null)
  assert.equal(motion('c', 'a', 'b'), undefined)
})

test('the viewport aligns to the trigger and stays 10px inside the document', () => {
  const rect = (left, top, width, height) => ({
    getBoundingClientRect: () => ({ left, top, width, height }),
  })
  const previous = globalThis.document
  globalThis.document = { documentElement: { offsetWidth: 400, offsetHeight: 300 } }
  try {
    const root = rect(0, 0, 400, 40)
    const content = { offsetWidth: 200, offsetHeight: 100 }
    assert.deepEqual(getViewportPosition(root, rect(150, 0, 100, 40), content, 'center'), {
      left: 100,
      top: 10,
    })
    assert.deepEqual(getViewportPosition(root, rect(150, 0, 100, 40), content, 'start'), {
      left: 150,
      top: 10,
    })
    assert.deepEqual(getViewportPosition(root, rect(0, 0, 60, 40), content, 'end'), {
      left: 10,
      top: 10,
    })
    assert.deepEqual(getViewportPosition(root, rect(340, 0, 60, 40), content, 'start'), {
      left: 190,
      top: 10,
    })
  } finally {
    globalThis.document = previous
  }
})
