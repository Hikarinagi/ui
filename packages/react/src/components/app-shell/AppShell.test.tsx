import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import { AppShell, type AppShellProps } from './AppShell'
import { Sidebar } from '../sidebar/Sidebar'
import { NavLink } from '../nav-link/NavLink'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function harness() {
  const { container } = render(
    <AppShell
      header={<span>Hina Docs</span>}
      sidebarContent={
        <Sidebar>
          <NavLink href="#a" active>
            组件
          </NavLink>
        </Sidebar>
      }
    >
      <p>正文内容</p>
    </AppShell>,
  )
  return container
}

const classes = (element: Element) => [...element.classList]

describe('结构 · 固定壳,内容滚动交给 ScrollArea', () => {
  it('壳占满视口且自身不滚,地面归壳;main 内是 ScrollArea', () => {
    const w = harness()
    const shell = w.querySelector('div')!
    expect(classes(shell)).toContain('bg-canvas')
    expect(classes(shell)).toContain('h-screen')
    expect(classes(shell)).toContain('overflow-hidden')
    expect(w.querySelector('main .hn-scroll-area')).not.toBeNull()
    expect(w.querySelector('main')!.textContent).toBe('正文内容')
  })

  it('header 定高不吸顶(壳固定无需 sticky),侧栏槽全高、窄屏隐藏', () => {
    const w = harness()
    const header = w.querySelector('header')!
    expect(classes(header)).toContain('shrink-0')
    expect(classes(header)).not.toContain('sticky')

    const row = w.querySelector('div')!.firstElementChild as HTMLElement
    const rail = row.firstElementChild as HTMLElement
    expect(rail.className).toContain('h-full')
    expect(rail.className).toContain('hidden')
    expect(rail.className).toContain('lg:block')
    expect(rail.nextElementSibling?.contains(header)).toBe(true)
  })

  it('banner 槽在最顶部横贯整个壳,侧栏与内容列在它下面一行', () => {
    const { container } = render(
      <AppShell banner={<p>公告</p>} sidebarContent={<Sidebar />}>
        <p>正文</p>
      </AppShell>,
    )
    const root = container.querySelector('div')!
    expect(root.className).toContain('flex-col')
    const top = root.firstElementChild as HTMLElement
    expect(top.textContent).toBe('公告')
    expect(top.className).toContain('shrink-0')
    const row = top.nextElementSibling as HTMLElement
    expect(row.className).toContain('flex-1')
    expect(row.querySelector('aside')).not.toBeNull()
    expect(row.querySelector('main')).not.toBeNull()
  })

  it('侧栏收成 rail 时只有侧栏里的 NavLink 收起,顶栏与正文里的保持原样', () => {
    const { container } = render(
      <AppShell
        sidebar="rail"
        header={
          <NavLink href="#header" label="顶栏">
            顶栏
          </NavLink>
        }
        sidebarContent={
          <Sidebar>
            <NavLink href="#sidebar" label="侧栏">
              侧栏
            </NavLink>
          </Sidebar>
        }
      >
        <NavLink href="#main" label="正文">
          正文
        </NavLink>
      </AppShell>,
    )
    const link = (href: string) => container.querySelector(`a[href="${href}"]`)!
    const label = (href: string) => link(href).querySelector('[data-hn-label]')!
    expect(label('#sidebar').getAttribute('data-collapsed')).toBe('')
    expect(link('#sidebar').getAttribute('aria-label')).toBe('侧栏')
    for (const href of ['#header', '#main']) {
      expect(label(href).hasAttribute('data-collapsed')).toBe(false)
      expect(label(href).hasAttribute('aria-hidden')).toBe(false)
      expect(link(href).hasAttribute('aria-label')).toBe(false)
    }
  })

  it('无 header / 无侧栏的降级形态', () => {
    const { container } = render(
      <AppShell>
        <p>仅正文</p>
      </AppShell>,
    )
    expect(container.querySelector('header')).toBeNull()
    expect(container.querySelector('main')!.previousElementSibling).toBeNull()
    expect(container.querySelector('main .hn-scroll-area')).not.toBeNull()
  })
})

describe('a11y', () => {
  it('banner / complementary / main 地标齐备且无违规', async () => {
    const w = harness()
    expect(w.querySelector('header')).not.toBeNull()
    expect(w.querySelector('aside')).not.toBeNull()
    expect(w.querySelector('main')).not.toBeNull()
    await expectNoA11yViolations(w.firstElementChild as HTMLElement)
  })
})

describe('移动端抽屉 · 标准行为可被调用方接管', () => {
  function routed(props: AppShellProps) {
    history.replaceState(null, '', '/a')
    const wrapper = render(
      <AppShell {...props} sidebarContent={<Sidebar />}>
        <p />
      </AppShell>,
    )
    const navigate = (fullPath: string) =>
      act(async () => {
        history.pushState(null, '', fullPath)
        window.dispatchEvent(new PopStateEvent('popstate'))
        await Promise.resolve()
      })
    return { wrapper, navigate }
  }

  it('默认随 fullPath 变化关闭;autoClose 关掉后交由调用方决定', async () => {
    const open = { value: true }
    const a = routed({
      mobileOpen: open.value,
      onMobileOpenChange: (v: boolean) => (open.value = v),
    })
    await a.navigate('/b')
    expect(open.value).toBe(false)

    const kept = { value: true }
    const b = routed({
      autoClose: false,
      mobileOpen: kept.value,
      onMobileOpenChange: (v: boolean) => (kept.value = v),
    })
    await b.navigate('/c')
    expect(kept.value).toBe(true)
  })
})
