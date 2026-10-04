import { describe, expect, it, vi, beforeEach } from 'vitest'
import { Collapsible } from './Collapsible'
import { CollapsibleTrigger } from './CollapsibleTrigger'
import { CollapsibleContent } from './CollapsibleContent'
import { mount } from '../../../test/mount'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function sample(target: Element, until: () => boolean) {
  return new Promise<number[]>(resolve => {
    const out: number[] = []
    function frame() {
      out.push(target.getBoundingClientRect().top)
      if (until()) resolve(out)
      else requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  })
}

describe('collapsible · 带 gap 的栈里开合', () => {
  it('收合到底后加 hidden 那一帧兄弟不跳，展开第一帧也不跳', async () => {
    const open = signal(true)
    function Harness() {
      const value = open.use()
      return (
        <div style={{ width: '480px' }}>
          <Collapsible open={value} onOpenChange={next => (open.value = next)}>
            <div style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }}>
              <CollapsibleTrigger>展开</CollapsibleTrigger>
              <CollapsibleContent>
                <p style={{ height: '60px' }}>内容</p>
              </CollapsibleContent>
              <div data-sibling="" style={{ height: '20px' }} />
            </div>
          </Collapsible>
        </div>
      )
    }
    const w = await mount(<Harness />)
    const content = w.container.querySelector('.hn-anim-collapse') as HTMLElement
    const sibling = w.container.querySelector('[data-sibling]') as HTMLElement
    const start = sibling.getBoundingClientRect().top
    expect(content.hidden).toBe(false)
    expect(content.getBoundingClientRect().height).toBe(60)
    expect(content.style.getPropertyValue('--hn-collapse-gap')).toBe('8px')
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    open.value = false
    await tick()
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
