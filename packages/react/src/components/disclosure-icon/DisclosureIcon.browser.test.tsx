import { describe, expect, it, beforeEach, vi } from 'vitest'
import { DisclosureIcon } from './DisclosureIcon'
import { Collapsible } from '../collapsible/Collapsible'
import { CollapsibleTrigger } from '../collapsible/CollapsibleTrigger'
import { CollapsibleContent } from '../collapsible/CollapsibleContent'
import { Button } from '../button/Button'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

const rotateOf = (el: Element) => getComputedStyle(el).rotate

function Disclosure({ direction, inner = false }: { direction: 'down' | 'end'; inner?: boolean }) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          tone="neutral"
          trailing={<DisclosureIcon direction={direction} className="outer-mark" />}
        >
          开关
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {inner ? (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                tone="neutral"
                trailing={<DisclosureIcon className="inner-mark" />}
              >
                内层开关
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p>内层内容</p>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <p>内容</p>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

describe('随触发器的开合旋转', () => {
  it('调用方不写任何类,收起不转、展开转半圈', async () => {
    const w = await mount(<Disclosure direction="down" />)
    const mark = w.container.querySelector('.outer-mark')!
    expect(rotateOf(mark)).toBe('none')

    w.container.querySelector('button')!.click()
    await vi.waitFor(() => expect(rotateOf(mark)).toBe('180deg'))
  })

  it('direction=end 转四分之一圈', async () => {
    const w = await mount(<Disclosure direction="end" />)
    const mark = w.container.querySelector('.outer-mark')!
    expect(rotateOf(mark)).toBe('none')

    w.container.querySelector('button')!.click()
    await vi.waitFor(() => expect(rotateOf(mark)).toBe('90deg'))
  })

  it('过渡属性含 rotate,不是硬切', async () => {
    const w = await mount(<Disclosure direction="down" />)
    expect(
      getComputedStyle(w.container.querySelector('.outer-mark')!).transitionProperty,
    ).toContain('rotate')
  })
})

describe('嵌套安全 —— 整套机制的结构前提', () => {
  it('外层展开时,内层收起的指示物不受影响', async () => {
    const w = await mount(<Disclosure direction="down" inner />)
    const outer = w.container.querySelector('.outer-mark')!

    w.container.querySelectorAll('button')[0]!.click()
    await vi.waitFor(() => expect(rotateOf(outer)).toBe('180deg'))

    const inner = w.container.querySelector('.inner-mark')!
    expect(rotateOf(inner)).toBe('none')

    w.container.querySelectorAll('button')[1]!.click()
    await vi.waitFor(() => expect(rotateOf(inner)).toBe('180deg'))
    expect(rotateOf(outer)).toBe('180deg')
  })
})
