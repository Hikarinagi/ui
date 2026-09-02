import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import Collapsible from './Collapsible.vue'
import CollapsibleTrigger from './CollapsibleTrigger.vue'
import CollapsibleContent from './CollapsibleContent.vue'
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

function sample(target: Element, until: () => boolean) {
  return new Promise<number[]>(resolve => {
    const out: number[] = []
    function tick() {
      out.push(target.getBoundingClientRect().top)
      if (until()) resolve(out)
      else requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

describe('collapsible · 带 gap 的栈里开合', () => {
  it('收合到底后加 hidden 那一帧兄弟不跳，展开第一帧也不跳', async () => {
    const open = ref(true)
    const w = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Collapsible,
              { open: open.value, 'onUpdate:open': (v: boolean) => (open.value = v) },
              () =>
                h('div', { style: 'display:flex;flex-direction:column;row-gap:8px' }, [
                  h(CollapsibleTrigger, null, () => '展开'),
                  h(CollapsibleContent, null, () => h('p', { style: 'height:60px' }, '内容')),
                  h('div', { 'data-sibling': '', style: 'height:20px' }),
                ]),
            )
        },
      }),
      { attachTo: attach() },
    )
    mounted.push(w)
    const content = w.find('.hn-anim-collapse').element as HTMLElement
    const sibling = w.find('[data-sibling]').element as HTMLElement
    const start = sibling.getBoundingClientRect().top
    expect(content.hidden).toBe(false)
    expect(content.getBoundingClientRect().height).toBe(60)
    expect(content.style.getPropertyValue('--hn-collapse-gap')).toBe('8px')
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    open.value = false
    await nextTick()
    expect(content.getAttribute('data-state')).toBe('closed')
    await vi.waitFor(() => expect(getComputedStyle(content).animationName).toBe('hn-collapse-out'))
    const closing = await sample(sibling, () => content.hidden)
    const deltas = closing.slice(1).map((top, i) => closing[i]! - top)
    expect(Math.max(...deltas)).toBeGreaterThan(0)
    expect(deltas[deltas.length - 1]!).toBeLessThan(1)
    expect(Math.round(start - closing[closing.length - 1]!)).toBe(60 + 8)
    await vi.waitFor(() => expect(content.hidden).toBe(true))

    const settled = sibling.getBoundingClientRect().top
    open.value = true
    let frames = 0
    const opening = await sample(sibling, () => ++frames > 25)
    expect(opening[0]! - settled).toBeLessThan(1)
    expect(opening.slice(1).every((top, i) => top >= opening[i]!)).toBe(true)
    expect(Math.round(opening[opening.length - 1]! - settled)).toBe(60 + 8)
  })
})
