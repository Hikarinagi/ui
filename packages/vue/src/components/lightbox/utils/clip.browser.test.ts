import { afterEach, expect, it } from 'vitest'
import { clipOf } from './clip'

afterEach(() => {
  document.body.innerHTML = ''
})

function element(style: string, parent: HTMLElement = document.body, tag = 'div') {
  const node = document.createElement(tag)
  node.style.cssText = style
  parent.append(node)
  return node
}

function read(node: HTMLElement) {
  return clipOf(node, node.getBoundingClientRect())
}

it.each([0, 1, 3])('读取第 %i 层裁剪祖先的圆角', depth => {
  let node = element('width:160px;height:120px;border-radius:16px;overflow:hidden')
  for (let at = 0; at < depth; at += 1) node = element('width:100%;height:100%', node)
  expect(read(node).corners).toEqual(Array.from({ length: 4 }, () => ({ x: 16, y: 16 })))
})

it('非裁剪祖先的圆角不影响图片', () => {
  const parent = element('width:160px;height:120px;border-radius:16px')
  const img = element('width:100%;height:100%', parent)
  expect(read(img).corners.every(corner => corner.x === 0 && corner.y === 0)).toBe(true)
})

it('图片未贴到外围容器的角时不继承圆角', () => {
  const parent = element(
    'width:200px;height:160px;padding:20px;box-sizing:border-box;border-radius:16px;overflow:hidden',
  )
  const img = element('width:160px;height:120px', parent)
  expect(read(img).corners.every(corner => corner.x === 0 && corner.y === 0)).toBe(true)
})

it('网格内的图片只继承贴到容器边界的角', () => {
  const parent = element(
    'display:grid;grid-template-columns:100px 100px;width:200px;height:200px;border-radius:16px;overflow:hidden',
  )
  const cells = Array.from({ length: 4 }, () => element('width:100px;height:100px', parent))
  for (const [index, cell] of cells.entries()) {
    const expected = [0, 0, 0, 0]
    expected[[0, 1, 3, 2][index]!] = 16
    expect(read(cell).corners.map(corner => corner.x)).toEqual(expected)
  }
})

it('边框内侧按内圆角裁剪,四角和椭圆半径分别计算', () => {
  const parent = element(
    'width:164px;height:124px;box-sizing:border-box;border:2px solid;border-radius:18px 22px 26px 30px / 12px 16px 20px 24px;overflow:hidden',
    document.body,
    'figure',
  )
  const img = element('width:160px;height:120px', parent)
  expect(read(img).corners).toEqual([
    { x: 16, y: 10 },
    { x: 20, y: 14 },
    { x: 24, y: 18 },
    { x: 28, y: 22 },
  ])
})

it('百分比圆角与祖先缩放转换为视口尺寸', () => {
  const parent = element(
    'width:160px;height:120px;border-radius:50%;overflow:hidden;transform:scale(1.5);transform-origin:top left',
  )
  const img = element('width:100%;height:100%', parent)
  expect(read(img).corners).toEqual(Array.from({ length: 4 }, () => ({ x: 120, y: 90 })))
})

it('祖先同时裁掉超出边界的矩形区域', () => {
  const parent = element('width:160px;height:120px;border-radius:16px;overflow:hidden')
  const img = element('width:200px;height:160px', parent)
  const clip = read(img)
  expect([clip.rect.width, clip.rect.height]).toEqual([160, 120])
  expect(clip.corners).toEqual(Array.from({ length: 4 }, () => ({ x: 16, y: 16 })))
})
