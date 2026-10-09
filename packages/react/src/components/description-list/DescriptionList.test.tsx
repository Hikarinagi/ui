import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { DescriptionList } from './DescriptionList'
import { DescriptionTerm } from './DescriptionTerm'
import { DescriptionDetails } from './DescriptionDetails'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement
const texts = (root: Element, selector: string) =>
  [...root.querySelectorAll(selector)].map(n => n.textContent?.trim())

const pairs = () => [
  <dt key="1">原名</dt>,
  <dd key="2">狼と香辛料</dd>,
  <dt key="3">作者</dt>,
  <dd key="4">未知</dd>,
]

describe('横向布局', () => {
  it('orientation 为 horizontal 时在根元素标出方向,默认不带该属性', () => {
    const horizontal = mount(<DescriptionList orientation="horizontal">{pairs()}</DescriptionList>)
    expect(horizontal.getAttribute('data-orientation')).toBe('horizontal')
    expect(
      mount(<DescriptionList>{pairs()}</DescriptionList>).hasAttribute('data-orientation'),
    ).toBe(false)
    const vertical = mount(<DescriptionList orientation="vertical">{pairs()}</DescriptionList>)
    expect(vertical.hasAttribute('data-orientation')).toBe(false)
  })
})

describe('渲染', () => {
  it('渲染 dl,插槽的 dt / dd 原样进入', () => {
    const el = mount(<DescriptionList>{pairs()}</DescriptionList>)
    expect(el.tagName).toBe('DL')
    expect(texts(el, 'dt')).toEqual(['原名', '作者'])
    expect(texts(el, 'dd')).toEqual(['狼と香辛料', '未知'])
  })
})

const wrapped = () => [
  <DescriptionTerm key="1">原名</DescriptionTerm>,
  <DescriptionDetails key="2">狼と香辛料</DescriptionDetails>,
  <DescriptionTerm key="3">作者</DescriptionTerm>,
  <DescriptionDetails key="4">未知</DescriptionDetails>,
]

describe('条目件', () => {
  it('分别渲染为 dt 与 dd', () => {
    expect(mount(<DescriptionTerm />).tagName).toBe('DT')
    expect(mount(<DescriptionDetails />).tagName).toBe('DD')
  })

  it('插槽内容原样渲染', () => {
    expect(mount(<DescriptionTerm>原名</DescriptionTerm>).textContent?.trim()).toBe('原名')
    expect(mount(<DescriptionDetails>狼と香辛料</DescriptionDetails>).textContent?.trim()).toBe(
      '狼と香辛料',
    )
  })

  it('class 追加到根元素', () => {
    expect([...mount(<DescriptionTerm className="text-muted" />).classList]).toContain('text-muted')
    expect([...mount(<DescriptionDetails className="tabular" />).classList]).toContain('tabular')
  })

  it('作为容器的直接子元素落成 dt / dd,可被 hn-dl 的 > dt 与 > dd 选中', () => {
    const el = mount(<DescriptionList>{wrapped()}</DescriptionList>)
    expect(texts(el, ':scope > dt')).toEqual(['原名', '作者'])
    expect(texts(el, ':scope > dd')).toEqual(['狼と香辛料', '未知'])
  })

  it('一个术语可配多条描述,不强制成对', () => {
    const el = mount(
      <DescriptionList>
        <DescriptionTerm>作者</DescriptionTerm>
        <DescriptionDetails>支倉凍砂</DescriptionDetails>
        <DescriptionDetails>文倉十</DescriptionDetails>
      </DescriptionList>,
    )
    expect(el.querySelectorAll('dt')).toHaveLength(1)
    expect(texts(el, 'dd')).toEqual(['支倉凍砂', '文倉十'])
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const el = mount(<DescriptionList>{pairs()}</DescriptionList>)
    await expectNoA11yViolations(el)
  })

  it('用条目件组装同样无 a11y 违规', async () => {
    const el = mount(<DescriptionList>{wrapped()}</DescriptionList>)
    await expectNoA11yViolations(el)
  })
})
