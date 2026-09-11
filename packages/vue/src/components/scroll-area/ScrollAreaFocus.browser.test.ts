import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import ScrollArea from './ScrollArea.vue'
import '../../../test/browser.css'

let wrapper: VueWrapper | undefined
afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
})

function mountArea(direction: 'vertical' | 'horizontal' | 'both' = 'vertical') {
  wrapper = mount(ScrollArea, {
    props: { direction, focusable: true, label: '代码' },
    attrs: { style: 'height:120px;width:240px' },
    slots: { default: () => h('div', { style: 'width:800px;height:800px' }, '内容') },
    attachTo: document.body,
  })
  return wrapper
}

async function enhanced() {
  await vi.waitFor(() =>
    expect(
      wrapper!.get('[role="region"]').attributes('data-overlayscrollbars-viewport'),
    ).toBeDefined(),
  )
  return wrapper!.get('[role="region"]').element as HTMLElement
}

it.each([
  ['vertical', '{ArrowDown}', 'scrollTop'],
  ['horizontal', '{ArrowRight}', 'scrollLeft'],
  ['both', '{ArrowDown}', 'scrollTop'],
] as const)('%s 聚焦实际视口后方向键可滚动', async (direction, key, offset) => {
  mountArea(direction)
  const viewport = await enhanced()
  viewport.focus()
  await userEvent.keyboard(key)
  await vi.waitFor(() => expect(viewport[offset]).toBeGreaterThan(0))
  expect(viewport.getAttribute('aria-label')).toBe('代码')
})

it('初始化前已经聚焦宿主时，焦点与地标一起迁移至视口', async () => {
  const w = mountArea()
  const initial = w.get('[role="region"]').element as HTMLElement
  expect(initial.hasAttribute('data-overlayscrollbars-initialize')).toBe(true)
  initial.focus()
  const viewport = await enhanced()
  await vi.waitFor(() => expect(document.activeElement).toBe(viewport))
  expect(w.findAll('[role="region"]')).toHaveLength(1)
  expect(initial.hasAttribute('tabindex')).toBe(false)
})

it('Tab 只有一个滚动区停靠点，之后可以正常离开', async () => {
  const before = document.createElement('button')
  before.textContent = '前'
  document.body.appendChild(before)
  mountArea()
  const after = document.createElement('button')
  after.textContent = '后'
  document.body.appendChild(after)
  const viewport = await enhanced()
  before.focus()
  await userEvent.tab()
  expect(document.activeElement).toBe(viewport)
  await userEvent.tab()
  expect(document.activeElement).toBe(after)
})

it('focusable 与名称更新同步到视口，不留下旧地标', async () => {
  const w = mountArea()
  const viewport = await enhanced()
  await w.setProps({ label: '新名称' })
  expect(viewport.getAttribute('aria-label')).toBe('新名称')
  await w.setProps({ focusable: false })
  expect(w.find('[role="region"]').exists()).toBe(false)
  expect(w.find('[tabindex="0"]').exists()).toBe(false)
  await w.setProps({ focusable: true })
  expect(w.findAll('[role="region"]')).toHaveLength(1)
  expect(viewport.getAttribute('tabindex')).toBe('0')
})
