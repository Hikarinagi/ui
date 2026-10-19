import assert from 'node:assert/strict'
import { test } from 'node:test'
import { settleScale } from '../src/lib/image-placeholder.ts'

const wide = {
  fit: 'contain',
  box: { width: 300, height: 300 },
  image: { width: 1200, height: 400 },
  thumb: { width: 32, height: 9 },
}

function close(actual, expected) {
  for (const key of Object.keys(expected)) {
    assert.ok(
      Math.abs(actual[key] - expected[key]) < 1e-6,
      `${key}: ${actual[key]} != ${expected[key]}`,
    )
  }
}

function mapped(settle, axis, start, size) {
  const origin = axis === 'x' ? settle.originX : settle.originY
  const scale = axis === 'x' ? settle.scaleX : settle.scaleY
  return [origin + (start - origin) * scale, size * scale]
}

test('contain scales the thumbnail from its approximate box to the image box about the centre', () => {
  const settle = settleScale({ ...wide, position: '50% 50%' })
  close(settle, { scaleX: 1, scaleY: 100 / 84.375, originX: 150, originY: 150 })
})

test('the scaled thumbnail lands on the image box for every computed object-position form', () => {
  const tall = {
    ...wide,
    image: { width: 400, height: 1200 },
    thumb: { width: 9, height: 32 },
  }
  for (const [input, axis, position, thumbStart, imageStart] of [
    [wide, 'y', '50% 0%', 0, 0],
    [wide, 'y', '0% 100%', 215.625, 200],
    [wide, 'y', '10px 20px', 20, 20],
    [wide, 'y', 'calc(100% - 10px) calc(100% - 5px)', 210.625, 195],
    [wide, 'y', '80% 10px', 10, 10],
    [wide, 'y', 'calc(50% + 10px) calc(25% + 4px)', 57.90625, 54],
    [tall, 'x', 'calc(100% - 10px) 50%', 205.625, 190],
    [tall, 'x', '0% 50%', 0, 0],
  ]) {
    const settle = settleScale({ ...input, position })
    const [landed, size] = mapped(settle, axis, thumbStart, 84.375)
    assert.ok(Math.abs(landed - imageStart) < 1e-6, `${position}: ${landed} != ${imageStart}`)
    assert.ok(Math.abs(size - 100) < 1e-6, `${position}: size ${size}`)
  }
})

test('scale-down never scales the image box past its natural size', () => {
  const settle = settleScale({
    fit: 'scale-down',
    position: '50% 50%',
    box: { width: 300, height: 300 },
    image: { width: 120, height: 40 },
    thumb: { width: 32, height: 9 },
  })
  close(settle, { scaleX: 120 / 300, scaleY: 40 / 84.375, originX: 150, originY: 150 })
})

test('nothing to settle when the fit fills the box, the boxes already agree or the position is unknown', () => {
  assert.equal(settleScale({ ...wide, fit: 'cover', position: '50% 50%' }), null)
  assert.equal(settleScale({ ...wide, fit: 'fill', position: '50% 50%' }), null)
  assert.equal(settleScale({ ...wide, fit: 'none', position: '50% 50%' }), null)
  assert.equal(
    settleScale({ ...wide, position: '50% 50%', thumb: { width: 32, height: 32 / 3 } }),
    null,
  )
  assert.equal(settleScale({ ...wide, position: 'left' }), null)
  assert.equal(settleScale({ ...wide, position: 'calc(50% + 1em) 0px' }), null)
  assert.equal(settleScale({ ...wide, position: '50% 50%', image: { width: 0, height: 0 } }), null)
})
