import { describe, expect, it, beforeEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import Divider from './Divider.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function mountRow(dividerProps: Record<string, unknown>) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const App = defineComponent({
    render: () =>
      h('div', { style: 'display:flex;align-items:center;height:36px;width:200px' }, [
        h('span', '左'),
        h(Divider, { orientation: 'vertical', ...dividerProps }),
        h('span', '右'),
      ]),
  })
  mount(App, { attachTo: host })
  return document.querySelector('[role="separator"], [data-orientation]') as HTMLElement
}

describe('divider · 竖分隔线两用法', () => {
  it('默认拉满容器高', () => {
    const line = mountRow({})
    expect(line.offsetHeight).toBe(36)
    expect(line.offsetTop).toBe(0)
  })

  it('定高短线配 self-center 垂直居中,不顶对齐', () => {
    const line = mountRow({ class: 'h-6 self-center' })
    expect(line.offsetHeight).toBe(24)
    expect(line.offsetTop).toBe(6)
  })
})
