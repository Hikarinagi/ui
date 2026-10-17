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
  tourPageBlocked,
  resolveTourTarget,
  unionRect,
} from '../src/lib/tour.ts'
import { bezierEasing, stepSpring, tourPointerPoint } from '../src/lib/tour-engine.ts'

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

test('the page is blocked by the tour unless the step decides otherwise', () => {
  assert.equal(tourPageBlocked({}, false), false)
  assert.equal(tourPageBlocked({}, true), true)
  assert.equal(tourPageBlocked({ blockPage: false }, true), false)
  assert.equal(tourPageBlocked({ blockPage: true }, false), true)
})

test('rects, virtual elements and lists resolve to the union of their boxes', () => {
  const rect = resolveTourTarget({ x: 10, y: 20, width: 30, height: 40 })
  assert.deepEqual(rect.elements, [])
  assert.equal(rect.virtual, true)
  assert.deepEqual(rect.rect(), { x: 10, y: 20, width: 30, height: 40 })
  const virtual = { getBoundingClientRect: () => ({ left: 100, top: 50, width: 20, height: 10 }) }
  const union = resolveTourTarget([{ x: 10, y: 20, width: 30, height: 40 }, virtual])
  assert.deepEqual(union.rect(), { x: 10, y: 20, width: 110, height: 40 })
  assert.deepEqual(resolveTourTarget(() => virtual).rect(), {
    x: 100,
    y: 50,
    width: 20,
    height: 10,
  })
  assert.equal(resolveTourTarget([]), null)
  assert.equal(
    resolveTourTarget(() => null),
    null,
  )
  assert.deepEqual(unionRect([{ x: 5, y: 5, width: 1, height: 1 }]), {
    x: 5,
    y: 5,
    width: 1,
    height: 1,
  })
})

test('the spotlight spring settles on its goal without overshooting visibly', () => {
  const position = { x: 0, y: 0, width: 100, height: 40 }
  const velocity = { x: 0, y: 0, width: 0, height: 0 }
  const goal = { x: 300, y: 120, width: 60, height: 60 }
  let elapsed = 0
  let peak = 0
  let done = false
  while (!done && elapsed < 2) {
    done = stepSpring(position, velocity, goal, 1 / 60)
    peak = Math.max(peak, position.x)
    elapsed += 1 / 60
  }
  assert.ok(done)
  assert.ok(elapsed > 0.2 && elapsed < 0.8, `settled after ${elapsed}s`)
  assert.ok(peak < 301, `peaked at ${peak}`)
  assert.ok(Math.abs(position.x - goal.x) < 0.25)
})

test('the pointer easing follows the move curve', () => {
  const ease = bezierEasing([0.4, 0, 0.2, 1])
  assert.equal(ease(0), 0)
  assert.equal(ease(1), 1)
  const curve = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3
  for (const progress of [0.1, 0.25, 0.5, 0.75, 0.9]) {
    let low = 0
    let high = 1
    for (let i = 0; i < 60; i++) {
      const mid = (low + high) / 2
      if (curve(0.4, 0.2, mid) < progress) low = mid
      else high = mid
    }
    assert.ok(Math.abs(ease(progress) - curve(0, 1, low)) < 1e-3, `at ${progress}`)
  }
})

test('the pointer aims at a point or at the centre of a target', () => {
  assert.deepEqual(tourPointerPoint({ x: 3, y: 4 }), { x: 3, y: 4 })
  assert.deepEqual(tourPointerPoint({ x: 10, y: 20, width: 30, height: 40 }), { x: 25, y: 40 })
  assert.equal(tourPointerPoint(null), null)
})
