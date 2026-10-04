import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Avatar } from './Avatar'
import { AvatarGroup, type AvatarGroupProps } from './AvatarGroup'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const screen = render(ui)
  return { ...screen, element: screen.container.firstElementChild as HTMLElement }
}

function avatars(root: HTMLElement) {
  return [...root.children] as HTMLElement[]
}

function group(props: AvatarGroupProps, names: string[]) {
  return mount(
    <AvatarGroup {...props}>
      {names.map(name => (
        <Avatar key={name} name={name} />
      ))}
    </AvatarGroup>,
  )
}

describe('溢出计数', () => {
  it('不设 max 时全部显示,没有计数位', () => {
    const w = group({}, ['甲', '乙', '丙'])
    expect(avatars(w.element)).toHaveLength(3)
    expect(w.element.textContent).not.toContain('+')
  })

  it('超过 max 的部分折成 +N', () => {
    const w = group({ max: 2 }, ['甲', '乙', '丙', '丁', '戊'])
    expect(avatars(w.element)).toHaveLength(3)
    expect(w.element.textContent).toContain('+3')
  })

  it('刚好等于 max 时不出现计数位', () => {
    const w = group({ max: 3 }, ['甲', '乙', '丙'])
    expect(w.element.textContent).not.toContain('+')
  })

  it('v-for 产生的 fragment 子节点照样计数', () => {
    const w = mount(
      <AvatarGroup max={2}>
        <Avatar name="甲" />
        <>
          {['乙', '丙', '丁'].map(name => (
            <Avatar key={name} name={name} />
          ))}
        </>
      </AvatarGroup>,
    )
    expect(w.element.textContent).toContain('+2')
  })
})

describe('尺寸继承', () => {
  it('组的 size 透给子头像,子头像自己写的 size 优先', () => {
    const w = mount(
      <AvatarGroup size="lg">
        <Avatar name="甲" />
        <Avatar name="乙" size="sm" />
      </AvatarGroup>,
    )
    const byName = (name: string) => avatars(w.element).find(a => a.textContent === name)!
    expect(byName('甲').classList).toContain('size-10')
    expect(byName('乙').classList).toContain('size-6')
  })
})
