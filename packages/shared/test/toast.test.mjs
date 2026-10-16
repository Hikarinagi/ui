import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  hotkeyMessage,
  isDeltaInDirection,
  swipeDelta,
  swipeStartBuffer,
  viewportLabel,
} from '../src/primitives/toast/index.ts'

test('a swipe only moves along its direction and never backwards', () => {
  const start = { x: 100, y: 100 }
  assert.deepEqual(swipeDelta(start, { clientX: 130, clientY: 90 }, 'right').delta, { x: 30, y: 0 })
  assert.deepEqual(swipeDelta(start, { clientX: 70, clientY: 90 }, 'right').delta, { x: 0, y: 0 })
  assert.deepEqual(swipeDelta(start, { clientX: 70, clientY: 90 }, 'left').delta, { x: -30, y: 0 })
  assert.deepEqual(swipeDelta(start, { clientX: 100, clientY: 60 }, 'up').delta, { x: 0, y: -40 })
  assert.deepEqual(swipeDelta(start, { clientX: 130, clientY: 90 }, 'right').y, -10)
})

test('a delta counts once it passes the threshold on the swipe axis', () => {
  assert.equal(isDeltaInDirection({ x: 30, y: 0 }, 'right', 20), true)
  assert.equal(isDeltaInDirection({ x: 10, y: 0 }, 'right', 20), false)
  assert.equal(isDeltaInDirection({ x: 0, y: 30 }, 'right', 20), false)
  assert.equal(isDeltaInDirection({ x: 0, y: 30 }, 'down', 20), true)
  assert.equal(swipeStartBuffer('touch'), 10)
  assert.equal(swipeStartBuffer('mouse'), 2)
})

test('the viewport label names the hotkey', () => {
  assert.equal(hotkeyMessage(['altKey', 'KeyT']), 'alt+T')
  assert.equal(hotkeyMessage(['Digit1']), '1')
  assert.equal(viewportLabel('Notifications ({hotkey})', 'F8'), 'Notifications (F8)')
  assert.equal(
    viewportLabel(hotkey => `Press ${hotkey}`, 'F8'),
    'Press F8',
  )
})
