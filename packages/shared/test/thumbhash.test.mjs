import assert from 'node:assert/strict'
import { test } from 'node:test'
import { thumbHashToDataURL } from 'thumbhash'
import { decodeThumbhash, thumbhashToDataUrl } from '../src/lib/thumbhash.ts'

const hash = 'YMcJJIIhukWZenmwmHWb9Pc5nw=='

function size(url) {
  const png = Buffer.from(url.slice('data:image/png;base64,'.length), 'base64')
  return [png.readUInt32BE(16), png.readUInt32BE(20)]
}

test('a base64 ThumbHash decodes to a PNG data URL', () => {
  const url = thumbhashToDataUrl(hash)
  assert.equal(url, thumbHashToDataURL(Buffer.from(hash, 'base64')))
  assert.deepEqual(size(url), [32, 18])
})

test('decoding also reports the size of the decoded image', () => {
  assert.deepEqual(decodeThumbhash(hash), { url: thumbhashToDataUrl(hash), width: 32, height: 18 })
  const { width, height, url } = decodeThumbhash('K2kGLQRRemhndpNMn6OolZmP9956')
  assert.deepEqual([width, height], size(url))
  assert.equal(decodeThumbhash('not a hash!'), null)
})

test('URL-safe base64, missing padding and surrounding spaces are accepted', () => {
  const url = thumbhashToDataUrl(hash)
  const safe = hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  assert.equal(thumbhashToDataUrl(safe), url)
  assert.equal(thumbhashToDataUrl(` ${hash}\n`), url)
})

test('portrait hashes keep a portrait placeholder', () => {
  const [width, height] = size(thumbhashToDataUrl('K2kGLQRRemhndpNMn6OolZmP9956'))
  assert.ok(height > width)
  assert.equal(height, 32)
})

test('values that are not a ThumbHash give no placeholder', () => {
  assert.equal(thumbhashToDataUrl(''), null)
  assert.equal(thumbhashToDataUrl('   '), null)
  assert.equal(thumbhashToDataUrl('not a hash!'), null)
  assert.equal(thumbhashToDataUrl('YMcJ'), null)
})
