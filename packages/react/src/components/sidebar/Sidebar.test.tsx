import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { Sidebar } from './Sidebar'
import { SidebarGroup } from './SidebarGroup'
import { NavLink } from '../nav-link/NavLink'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function harness() {
  const { container } = render(
    <Sidebar renderHeader={() => <span>Hina UI</span>} renderFooter={() => <span>v0.1.0</span>}>
      <SidebarGroup label="组件">
        <NavLink href="#a" active>
          Button
        </NavLink>
        <NavLink href="#b">Input</NavLink>
      </SidebarGroup>
      <SidebarGroup label="设计语言" defaultOpen={false}>
        <NavLink href="#c">薄墨</NavLink>
      </SidebarGroup>
    </Sidebar>,
  )
  return container.firstElementChild as HTMLElement
}

const classes = (element: Element) => [...element.classList]

describe('结构', () => {
  it('aside 地标 + 内层 nav 带 locale 兜底 aria-label,header/footer 插槽就位', () => {
    const w = harness()
    expect(w.tagName).toBe('ASIDE')
    expect(w.querySelector('nav')!.getAttribute('aria-label')).toBe('侧边导航')
    expect(w.textContent).toContain('Hina UI')
    expect(w.textContent).toContain('v0.1.0')
    expect(classes(w)).toContain('border-e')
  })

  it('无 header/footer 时不渲染对应容器;label 覆写 nav 名称', () => {
    const { container } = render(<Sidebar label="文档目录" />)
    expect(container.querySelectorAll('aside > div.shrink-0').length).toBe(0)
    expect(container.querySelector('nav')!.getAttribute('aria-label')).toBe('文档目录')
  })
})

describe('分组电池', () => {
  it('默认展开、点击收起,chevron 挂旋转组合;defaultOpen=false 组初始收起', async () => {
    const w = harness()
    const triggers = [...w.querySelectorAll('button')]
    expect(triggers[0]!.getAttribute('aria-expanded')).toBe('true')
    expect(triggers[1]!.getAttribute('aria-expanded')).toBe('false')

    expect(classes(triggers[0]!)).toContain('group/hn-disclosure')
    const mark = triggers[0]!.querySelector('span[aria-hidden="true"]')!
    expect(classes(mark)).toContain('hn-transition')
    expect(classes(mark)).toContain('group-data-open/hn-disclosure:rotate-90')

    fireEvent.click(triggers[0]!)
    expect(triggers[0]!.getAttribute('aria-expanded')).toBe('false')
  })

  it('组内行项就是 NavLink,选中态可达', () => {
    const w = harness()
    expect(w.querySelector('[aria-current="page"]')!.textContent).toBe('Button')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = harness()
    await expectNoA11yViolations(w)
  })
})
