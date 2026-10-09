import { afterEach, beforeEach, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import AppShell from './AppShell.vue'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
beforeEach(async () => {
  await page.viewport(1280, 800)
})
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

function shell(options: { class?: string; banner?: boolean; probe?: boolean } = {}) {
  const wrapper = mount(AppShell, {
    attachTo: document.body,
    props: { class: options.class },
    slots: {
      header: () => h('span', '标题'),
      ...(options.banner ? { banner: () => h('div', { class: 'h-10' }, '公告') } : {}),
      default: () =>
        h(
          'div',
          { 'data-page': '', class: 'min-h-full' },
          options.probe === false
            ? '正文'
            : [
                h('div', {
                  'data-probe': '',
                  class: 'h-[calc(100vh-var(--hn-app-shell-header-h))]',
                }),
              ],
        ),
    },
  })
  wrappers.push(wrapper)
  const height = (selector: string) => wrapper.get(selector).element.getBoundingClientRect().height
  return { height }
}

it('--hn-app-shell-header-h 等于顶栏的实际高度,主区域内可以用它计算', () => {
  const s = shell()
  expect(s.height('header')).toBe(57)
  expect(s.height('main')).toBe(800 - 57)
  expect(s.height('[data-probe]')).toBe(800 - 57)
})

it('在根元素上改写变量会同时改变顶栏高度', () => {
  const s = shell({ class: '[--hn-app-shell-header-h:4rem]' })
  expect(s.height('header')).toBe(64)
  expect(s.height('main')).toBe(800 - 64)
  expect(s.height('[data-probe]')).toBe(800 - 64)
})

it('主区域的直接子元素用 min-h-full 至少占满可视高度,有公告条时也成立', () => {
  const s = shell({ banner: true, probe: false })
  expect(s.height('main')).toBe(800 - 40 - 57)
  expect(s.height('[data-page]')).toBe(800 - 40 - 57)
})
