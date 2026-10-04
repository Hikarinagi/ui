import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { List } from './List'
import { ListItem } from './ListItem'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement
const texts = (root: Element, selector: string) =>
  [...root.querySelectorAll(selector)].map(li => li.textContent?.trim())

describe('渲染', () => {
  it('渲染为 li', () => {
    expect(mount(<ListItem />).tagName).toBe('LI')
  })

  it('插槽内容原样渲染', () => {
    expect(mount(<ListItem>甲</ListItem>).textContent?.trim()).toBe('甲')
  })

  it('class 追加到根元素', () => {
    const el = mount(<ListItem className="font-medium" />)
    expect([...el.classList]).toContain('font-medium')
  })

  it('原生 li 属性透传', () => {
    const el = mount(<ListItem value={3} />)
    expect(el.getAttribute('value')).toBe('3')
  })
})

describe('与容器组合', () => {
  it('作为 List 的直接子元素落成 li,可被 hn-list 的 > li 选中', () => {
    const el = mount(
      <List>
        <ListItem>甲</ListItem>
        <ListItem>乙</ListItem>
      </List>,
    )
    expect(el.tagName).toBe('UL')
    expect(texts(el, ':scope > li')).toEqual(['甲', '乙'])
  })

  it('可嵌套子列表', () => {
    const el = mount(
      <List>
        <ListItem>
          甲
          <List>
            <ListItem>甲一</ListItem>
          </List>
        </ListItem>
      </List>,
    )
    expect(texts(el, 'li li')).toEqual(['甲一'])
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const el = mount(
      <List>
        <ListItem>甲</ListItem>
        <ListItem>乙</ListItem>
      </List>,
    )
    await expectNoA11yViolations(el)
  })
})
