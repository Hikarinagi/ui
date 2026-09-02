import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Accordion from './Accordion.vue'
import AccordionItem from './AccordionItem.vue'
import AccordionTrigger from './AccordionTrigger.vue'
import AccordionContent from './AccordionContent.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  host.style.width = '480px'
  document.body.appendChild(host)
  return host
}

function harness(rootProps: Record<string, unknown> = {}) {
  const w = mount(
    defineComponent({
      setup() {
        return () =>
          h(Accordion, rootProps, () =>
            ['a', 'b', 'c'].map(value =>
              h(AccordionItem, { value }, () => [
                h(AccordionTrigger, null, () => `标题 ${value}`),
                h(AccordionContent, null, () => h('p', { style: 'height:48px' }, `内容 ${value}`)),
              ]),
            ),
          )
      },
    }),
    { attachTo: attach() },
  )
  mounted.push(w)
  return w
}

describe('accordion · 折叠列表', () => {
  it('展开走 hn-collapse-in，内容区从 0 长到自然高度；切换项时上一项收起', async () => {
    const w = harness()
    const [a, b] = w.findAll('button')
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    await userEvent.click(a!.element as HTMLElement)
    const content = document.getElementById(a!.attributes('aria-controls')!) as HTMLElement
    await vi.waitFor(() => expect(getComputedStyle(content).animationName).toBe('hn-collapse-in'))
    await vi.waitFor(() => expect(content.getBoundingClientRect().height).toBe(48 + 16))

    await userEvent.click(b!.element as HTMLElement)
    await vi.waitFor(() => expect(getComputedStyle(content).animationName).toBe('hn-collapse-out'))
    await vi.waitFor(() => expect(content.hidden).toBe(true))
    const other = document.getElementById(b!.attributes('aria-controls')!) as HTMLElement
    await vi.waitFor(() => expect(other.getBoundingClientRect().height).toBe(48 + 16))
  })

  it('触发器是整行：悬停落薄墨，按下不缩放，指示物随开合旋转', async () => {
    const w = harness()
    const trigger = w.find('button').element as HTMLElement
    const icon = trigger.querySelector('svg')!.parentElement as HTMLElement

    await userEvent.hover(trigger)
    await vi.waitFor(() =>
      expect(parseFloat(getComputedStyle(trigger, '::after').opacity)).toBeGreaterThan(0),
    )
    expect(getComputedStyle(trigger).getPropertyValue('--hn-press-scale').trim()).toBe('1')

    expect(getComputedStyle(icon).rotate).toBe('none')
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(getComputedStyle(icon).rotate).toBe('180deg'))
  })

  it('方向键在触发器之间移动焦点', async () => {
    const w = harness()
    const [a, b, c] = w.findAll('button')
    ;(a!.element as HTMLElement).focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(b!.element)
    await userEvent.keyboard('{End}')
    expect(document.activeElement).toBe(c!.element)
    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(b!.element)
  })
})
