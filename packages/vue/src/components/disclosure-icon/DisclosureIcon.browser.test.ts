import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import DisclosureIcon from './DisclosureIcon.vue'
import Collapsible from '../collapsible/Collapsible.vue'
import CollapsibleTrigger from '../collapsible/CollapsibleTrigger.vue'
import CollapsibleContent from '../collapsible/CollapsibleContent.vue'
import Button from '../button/Button.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

const rotateOf = (el: Element) => getComputedStyle(el).rotate

function disclosure(direction: 'down' | 'end', inner = false) {
  return defineComponent({
    setup() {
      return () =>
        h(Collapsible, null, () => [
          h(CollapsibleTrigger, { asChild: true }, () =>
            h(
              Button,
              { variant: 'ghost', tone: 'neutral' },
              {
                default: () => '开关',
                trailing: () => h(DisclosureIcon, { direction, class: 'outer-mark' }),
              },
            ),
          ),
          h(CollapsibleContent, null, () =>
            inner
              ? h(Collapsible, null, () => [
                  h(CollapsibleTrigger, { asChild: true }, () =>
                    h(
                      Button,
                      { variant: 'ghost', tone: 'neutral' },
                      {
                        default: () => '内层开关',
                        trailing: () => h(DisclosureIcon, { class: 'inner-mark' }),
                      },
                    ),
                  ),
                  h(CollapsibleContent, null, () => h('p', '内层内容')),
                ])
              : h('p', '内容'),
          ),
        ])
    },
  })
}

describe('随触发器的开合旋转', () => {
  it('调用方不写任何类,收起不转、展开转半圈', async () => {
    const w = mount(disclosure('down'), { attachTo: attach() })
    const mark = w.find('.outer-mark').element
    expect(rotateOf(mark)).toBe('none')

    await w.find('button').trigger('click')
    await vi.waitFor(() => expect(rotateOf(mark)).toBe('180deg'))
  })

  it('direction=end 转四分之一圈', async () => {
    const w = mount(disclosure('end'), { attachTo: attach() })
    const mark = w.find('.outer-mark').element
    expect(rotateOf(mark)).toBe('none')

    await w.find('button').trigger('click')
    await vi.waitFor(() => expect(rotateOf(mark)).toBe('90deg'))
  })

  it('过渡属性含 rotate,不是硬切', () => {
    const w = mount(disclosure('down'), { attachTo: attach() })
    expect(getComputedStyle(w.find('.outer-mark').element).transitionProperty).toContain('rotate')
  })
})

describe('嵌套安全 —— 整套机制的结构前提', () => {
  it('外层展开时,内层收起的指示物不受影响', async () => {
    const w = mount(disclosure('down', true), { attachTo: attach() })
    const outer = w.find('.outer-mark').element

    await w.findAll('button')[0]!.trigger('click')
    await vi.waitFor(() => expect(rotateOf(outer)).toBe('180deg'))

    const inner = w.find('.inner-mark').element
    expect(rotateOf(inner)).toBe('none')

    await w.findAll('button')[1]!.trigger('click')
    await vi.waitFor(() => expect(rotateOf(inner)).toBe('180deg'))
    expect(rotateOf(outer)).toBe('180deg')
  })
})
