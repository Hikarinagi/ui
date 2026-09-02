import { describe, expect, it } from 'vitest'
import { collapseHooks } from './collapse'

function stack(display: string, gap: string) {
  const parent = document.createElement('div')
  parent.style.display = display
  parent.style.flexDirection = 'column'
  parent.style.rowGap = gap
  parent.style.columnGap = gap
  const el = document.createElement('div')
  parent.appendChild(el)
  document.body.appendChild(parent)
  return el
}

describe('collapseHooks', () => {
  it('flex / grid 父容器的 gap 写进变量，进场结束后清除', () => {
    const hooks = collapseHooks()
    const el = stack('flex', '12px')
    hooks.beforeLeave(el)
    expect(el.style.getPropertyValue('--hn-collapse-gap')).toBe('12px')
    hooks.afterEnter(el)
    expect(el.style.getPropertyValue('--hn-collapse-gap')).toBe('')
    hooks.beforeEnter(el)
    expect(el.style.getPropertyValue('--hn-collapse-gap')).toBe('12px')
  })

  it('进场前元素尚未插入时，从占位节点的父容器量', () => {
    const parent = stack('flex', '16px').parentElement
    const detached = document.createElement('div')
    collapseHooks('y', () => parent).beforeEnter(detached)
    expect(detached.style.getPropertyValue('--hn-collapse-gap')).toBe('16px')
  })

  it('横向取 column-gap', () => {
    const el = stack('flex', '8px')
    collapseHooks('x').beforeLeave(el)
    expect(el.style.getPropertyValue('--hn-collapse-gap')).toBe('8px')
  })

  it('非栈式父容器与无父元素时为 0', () => {
    const block = stack('block', '12px')
    collapseHooks().beforeLeave(block)
    expect(block.style.getPropertyValue('--hn-collapse-gap')).toBe('0px')

    const orphan = document.createElement('div')
    collapseHooks().beforeEnter(orphan)
    expect(orphan.style.getPropertyValue('--hn-collapse-gap')).toBe('0px')
  })
})
