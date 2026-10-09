import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { createRef } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { AppShell, type AppShellHandle, type AppShellProps } from './AppShell'
import { keepScrollPosition } from '../../../../shared/src/lib/scroll-restore'
import { mount } from '../../../test/mount'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

const wrappers: Array<{ unmount: () => Promise<void> | void }> = []
let origin = ''

beforeEach(() => {
  origin = location.href
})
afterEach(async () => {
  for (const wrapper of wrappers.splice(0)) await wrapper.unmount()
  document.body.innerHTML = ''
  history.replaceState(null, '', origin)
})

const pause = (ms: number) => new Promise(done => setTimeout(done, ms))
const record = () => (history.state as { hnScroll?: Record<string, number> } | null)?.hnScroll

async function setup(props: Partial<AppShellProps> = { restoreKey: 'main' }) {
  const page = signal(location.pathname)
  const heights: Record<string, number> = {}
  const shell = createRef<AppShellHandle>()
  const follow = () => {
    page.value = location.pathname
  }
  window.addEventListener('popstate', follow)
  function Harness() {
    const current = page.use()
    return (
      <AppShell ref={shell} {...props}>
        <div key={current} data-page={current} style={{ height: heights[current] ?? 3000 }} />
      </AppShell>
    )
  }
  const wrapper = await mount(<Harness />)
  wrappers.push(wrapper)
  const viewport = () => shell.current!.mainViewport!
  await vi.waitFor(() => expect(shell.current?.mainArea?.instance).toBeTruthy())
  await pause(50)
  return {
    viewport,
    heights,
    async scrollTo(top: number) {
      viewport().scrollTop = top
      await pause(650)
    },
    go(path: string) {
      history.pushState({}, '', path)
      follow()
    },
    replace(path: string) {
      history.replaceState({}, '', path)
      follow()
    },
    stop: () => window.removeEventListener('popstate', follow),
  }
}

it('滚动位置写入当前历史记录,没有 restoreKey 时不写', async () => {
  const s = await setup()
  await s.scrollTo(600)
  expect(record()).toEqual({ main: 600 })
  s.stop()

  history.replaceState(null, '', origin)
  const plain = await setup({})
  await plain.scrollTo(400)
  expect(record()).toBeUndefined()
  plain.stop()
})

it('进入新页面回到顶部,后退与前进各自恢复到离开时的位置', async () => {
  const s = await setup()
  await s.scrollTo(600)

  s.go('/restore-b')
  await vi.waitFor(() => expect(s.viewport().scrollTop).toBe(0))
  expect(record()).toBeUndefined()
  await s.scrollTo(300)
  expect(record()).toEqual({ main: 300 })

  history.back()
  await vi.waitFor(() => expect(s.viewport().scrollTop).toBe(600))
  history.forward()
  await vi.waitFor(() => expect(s.viewport().scrollTop).toBe(300))
  s.stop()
})

it('只改写 hash 的 replaceState 不会把滚动拉回旧位置,后退到带记录的 hash 条目才恢复', async () => {
  const s = await setup()
  await s.scrollTo(600)
  s.viewport().scrollTop = 900
  history.replaceState(history.state, '', '#section')
  await pause(120)
  expect(s.viewport().scrollTop).toBe(900)
  await pause(600)
  expect(record()).toEqual({ main: 900 })

  history.pushState({}, '', '#next')
  await pause(120)
  expect(s.viewport().scrollTop).toBe(900)
  await s.scrollTo(1200)
  history.back()
  await vi.waitFor(() => expect(s.viewport().scrollTop).toBe(900))
  s.stop()
})

it('滚动后立刻离开也不会把旧位置写进新页面', async () => {
  const s = await setup()
  s.viewport().scrollTop = 700
  await pause(60)
  document.body.click()
  s.go('/restore-c')
  await pause(800)
  expect(s.viewport().scrollTop).toBe(0)
  expect(record()?.main ?? 0).toBe(0)
  history.back()
  await vi.waitFor(() => expect(s.viewport().scrollTop).toBe(700))
  s.stop()
})

it('目标页面的内容稍后才渲染到足够高时,等内容出现再落到保存的位置', async () => {
  const s = await setup()
  await s.scrollTo(1500)
  const first = location.pathname
  s.go('/restore-d')
  await vi.waitFor(() => expect(s.viewport().scrollTop).toBe(0))

  s.heights[first] = 400
  history.back()
  await vi.waitFor(() => expect(document.querySelector(`[data-page="${first}"]`)).not.toBeNull())
  await pause(200)
  expect(s.viewport().scrollTop).toBeLessThan(1500)

  const content = document.querySelector<HTMLElement>(`[data-page="${first}"]`)!
  content.style.height = '3000px'
  await vi.waitFor(() => expect(s.viewport().scrollTop).toBe(1500))
  s.stop()
})

it('keepScrollPosition 让下一次页面变化保持位置,只生效一次,并可按 restoreKey 指定', async () => {
  const s = await setup()
  await s.scrollTo(300)

  keepScrollPosition()
  s.go('/restore-keep?sort=new')
  await pause(700)
  expect(s.viewport().scrollTop).toBe(300)
  expect(record()).toEqual({ main: 300 })

  s.go('/restore-keep-next')
  await vi.waitFor(() => expect(s.viewport().scrollTop).toBe(0))

  await s.scrollTo(200)
  keepScrollPosition('other')
  s.go('/restore-keep-other')
  await vi.waitFor(() => expect(s.viewport().scrollTop).toBe(0))

  await s.scrollTo(150)
  keepScrollPosition('main')
  s.go('/restore-keep-main')
  await pause(700)
  expect(s.viewport().scrollTop).toBe(150)

  await s.scrollTo(500)
  history.back()
  await vi.waitFor(() => expect(s.viewport().scrollTop).toBe(150))
  s.stop()
})

it('保持位置时新页面的内容稍后才够高,等内容出现再回到原位置', async () => {
  const s = await setup()
  await s.scrollTo(900)
  s.heights['/restore-keep-late'] = 400

  keepScrollPosition()
  s.go('/restore-keep-late')
  await vi.waitFor(() =>
    expect(document.querySelector('[data-page="/restore-keep-late"]')).not.toBeNull(),
  )
  await pause(200)
  expect(s.viewport().scrollTop).toBeLessThan(900)

  document.querySelector<HTMLElement>('[data-page="/restore-keep-late"]')!.style.height = '3000px'
  await vi.waitFor(() => expect(s.viewport().scrollTop).toBe(900))
  s.stop()
})

it('keepScrollPosition 对替换当前历史记录的导航同样生效', async () => {
  const s = await setup()
  await s.scrollTo(400)

  keepScrollPosition()
  s.replace('/restore-keep-replace?sort=hot')
  await pause(700)
  expect(s.viewport().scrollTop).toBe(400)
  expect(record()).toEqual({ main: 400 })

  s.replace('/restore-keep-replace?sort=new')
  await vi.waitFor(() => expect(s.viewport().scrollTop).toBe(0))
  s.stop()
})

it('服务端输出带首帧恢复脚本,激活后移除,不产生激活警告', async () => {
  const error = vi.spyOn(console, 'error')
  const page = (
    <AppShell restoreKey="main">
      <div style={{ height: 3000 }} />
    </AppShell>
  )
  const html = renderToString(page)
  expect(html).toContain('<script>')
  expect(html).toContain('hnScroll')
  expect(renderToString(<AppShell />)).not.toContain('<script>')

  const host = document.createElement('div')
  document.body.append(host)
  host.innerHTML = html
  const root = hydrateRoot(host, page)
  wrappers.push({ unmount: () => root.unmount() })
  await vi.waitFor(() => expect(host.querySelector('script')).toBeNull())
  expect(error).not.toHaveBeenCalled()
  error.mockRestore()
})
