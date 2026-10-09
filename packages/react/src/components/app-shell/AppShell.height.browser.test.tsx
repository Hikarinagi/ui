import { afterEach, beforeEach, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { AppShell } from './AppShell'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

const wrappers: Array<{ unmount: () => Promise<void> }> = []
beforeEach(async () => {
  await page.viewport(1280, 800)
})
afterEach(async () => {
  for (const wrapper of wrappers.splice(0)) await wrapper.unmount()
  document.body.innerHTML = ''
})

async function shell(options: { className?: string; banner?: boolean; probe?: boolean } = {}) {
  const wrapper = await mount(
    <AppShell
      className={options.className}
      header={<span>标题</span>}
      banner={options.banner ? <div className="h-10">公告</div> : undefined}
    >
      <div data-page="" className="min-h-full">
        {options.probe === false ? (
          '正文'
        ) : (
          <div data-probe="" className="h-[calc(100vh-var(--hn-app-shell-header-h))]" />
        )}
      </div>
    </AppShell>,
  )
  wrappers.push(wrapper)
  const height = (selector: string) =>
    document.querySelector(selector)!.getBoundingClientRect().height
  return { height }
}

it('--hn-app-shell-header-h 等于顶栏的实际高度,主区域内可以用它计算', async () => {
  const s = await shell()
  expect(s.height('header')).toBe(57)
  expect(s.height('main')).toBe(800 - 57)
  expect(s.height('[data-probe]')).toBe(800 - 57)
})

it('在根元素上改写变量会同时改变顶栏高度', async () => {
  const s = await shell({ className: '[--hn-app-shell-header-h:4rem]' })
  expect(s.height('header')).toBe(64)
  expect(s.height('main')).toBe(800 - 64)
  expect(s.height('[data-probe]')).toBe(800 - 64)
})

it('主区域的直接子元素用 min-h-full 至少占满可视高度,有公告条时也成立', async () => {
  const s = await shell({ banner: true, probe: false })
  expect(s.height('main')).toBe(800 - 40 - 57)
  expect(s.height('[data-page]')).toBe(800 - 40 - 57)
})
