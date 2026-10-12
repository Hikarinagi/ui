import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cssTimeToMs } from '../src/lib/css-time.ts'

test('毫秒值原样返回', () => {
  assert.equal(cssTimeToMs('200ms'), 200)
  assert.equal(cssTimeToMs(' 1ms '), 1)
  assert.equal(cssTimeToMs('0ms'), 0)
})

test('秒值换算成毫秒,压缩工具改写后的写法也认', () => {
  assert.equal(cssTimeToMs('.2s'), 200)
  assert.equal(cssTimeToMs('0.45s'), 450)
  assert.equal(cssTimeToMs('1.2S'), 1200)
  assert.equal(cssTimeToMs('0s'), 0)
})

test('没有单位的数字按毫秒算', () => {
  assert.equal(cssTimeToMs('150'), 150)
})

test('空值、非数字和负值都是 0', () => {
  assert.equal(cssTimeToMs(''), 0)
  assert.equal(cssTimeToMs('auto'), 0)
  assert.equal(cssTimeToMs('-200ms'), 0)
})
