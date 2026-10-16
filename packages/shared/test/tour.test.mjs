import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  beaconPoint,
  clampTourStep,
  tourBeaconOnArrival,
  tourTargetBlocked,
  runTourChange,
  spotlightMask,
  spotlightPath,
  spotlightRect,
  spotlightShape,
  tourKeyAction,
} from '../src/lib/tour.ts'

test('steps are one-based and clamped to the list', () => {
  assert.equal(clampTourStep(0, 3), 1)
  assert.equal(clampTourStep(2, 3), 2)
  assert.equal(clampTourStep(9, 3), 3)
  assert.equal(clampTourStep(2.7, 3), 2)
  assert.equal(clampTourStep(Number.NaN, 3), 1)
  assert.equal(clampTourStep(2, 0), 1)
})

test('the spotlight pads the target and cuts a rounded hole out of the viewport', () => {
  const hole = spotlightRect({ left: 100, top: 50, width: 80, height: 30 }, 8)
  assert.deepEqual(hole, { x: 92, y: 42, width: 96, height: 46 })
  const path = spotlightPath({ width: 800, height: 600 }, hole, 8)
  assert.ok(path.startsWith("path(evenodd, 'M0 0H800V600H0Z"))
  assert.ok(path.includes('M100 42H180A8 8 0 0 1 188 50'))
  const tight = spotlightPath({ width: 800, height: 600 }, { x: 0, y: 0, width: 10, height: 4 }, 8)
  assert.ok(tight.includes('A2 2'))
})

test('the hole opens from its own centre with the same commands', () => {
  const { shape, origin } = spotlightShape(
    { width: 800, height: 600 },
    { x: 10, y: 10, width: 40, height: 20 },
  )
  const commands = value => value.replace(/[-\d.\s]+/g, ' ').trim()
  assert.equal(commands(origin), commands(shape))
  assert.ok(origin.includes('M30 20H30A0 0'))
})

test('the mask shows the current hole, closes the last one and starts without one', () => {
  const current = { shape: 'path(a)', origin: 'path(b)' }
  const last = { shape: 'path(c)', origin: 'path(d)' }
  assert.deepEqual(spotlightMask(current, last), {
    hole: 'shown',
    style: { clipPath: 'path(a)', '--hn-tour-hole-origin': 'path(b)' },
  })
  assert.deepEqual(spotlightMask(null, last), {
    hole: 'hidden',
    style: { '--hn-tour-hole': 'path(c)', '--hn-tour-hole-origin': 'path(d)' },
  })
  assert.deepEqual(spotlightMask(null, null), {})
})

test('the beacon sits on the inline-end top corner', () => {
  const rect = { x: 10, y: 20, width: 100, height: 40 }
  assert.deepEqual(beaconPoint(rect, 'ltr'), { x: 110, y: 20 })
  assert.deepEqual(beaconPoint(rect, 'rtl'), { x: 10, y: 20 })
})

test('arrow keys move through the tour unless typing or modified', () => {
  const key = (value, extra = {}) => ({ key: value, target: { closest: () => null }, ...extra })
  assert.equal(tourKeyAction(key('ArrowRight'), 'ltr'), 'next')
  assert.equal(tourKeyAction(key('ArrowLeft'), 'ltr'), 'prev')
  assert.equal(tourKeyAction(key('ArrowLeft'), 'rtl'), 'next')
  assert.equal(tourKeyAction(key('ArrowRight', { shiftKey: true }), 'ltr'), null)
  assert.equal(tourKeyAction(key('ArrowRight', { target: { closest: () => ({}) } }), 'ltr'), null)
  assert.equal(tourKeyAction(key('Enter'), 'ltr'), null)
})

test('beforeChange can veto synchronously or after a pending promise', async () => {
  const busy = []
  assert.equal(await runTourChange(undefined, 2, 1, value => busy.push(value)), true)
  assert.equal(
    await runTourChange(
      () => false,
      2,
      1,
      value => busy.push(value),
    ),
    false,
  )
  assert.equal(
    await runTourChange(
      () => undefined,
      2,
      1,
      value => busy.push(value),
    ),
    true,
  )
  assert.deepEqual(busy, [])
  assert.equal(
    await runTourChange(
      async () => false,
      2,
      1,
      value => busy.push(value),
    ),
    false,
  )
  assert.equal(
    await runTourChange(
      async () => true,
      3,
      2,
      value => busy.push(value),
    ),
    true,
  )
  assert.deepEqual(busy, [true, false, true, false])
  await assert.rejects(
    runTourChange(
      async () => Promise.reject(new Error('nope')),
      2,
      1,
      value => busy.push(value),
    ),
  )
  assert.equal(busy.at(-1), false)
})

test('the beacon only opens a tour or a step that asks for it on navigation', () => {
  assert.equal(tourBeaconOnArrival({}, true, false), true)
  assert.equal(tourBeaconOnArrival({}, true, true), false)
  assert.equal(tourBeaconOnArrival({ beacon: true }, false, true), true)
  assert.equal(tourBeaconOnArrival({ beacon: false }, true, false), false)
  assert.equal(tourBeaconOnArrival({}, false, false), false)
})

test('targets stay clickable unless the tour or the step blocks them', () => {
  assert.equal(tourTargetBlocked({}, false), false)
  assert.equal(tourTargetBlocked({}, true), true)
  assert.equal(tourTargetBlocked({ blockTarget: false }, true), false)
  assert.equal(tourTargetBlocked({ blockTarget: true }, false), true)
})
