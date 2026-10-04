import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { Collapsible, type CollapsibleProps } from './Collapsible'
import { CollapsibleTrigger } from './CollapsibleTrigger'
import { CollapsibleContent } from './CollapsibleContent'
import { Button } from '../button/Button'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const { container } = render(ui)
  return container
}

function harness(props: CollapsibleProps = {}) {
  return mount(
    <Collapsible {...props}>
      <CollapsibleTrigger>展开</CollapsibleTrigger>
      <CollapsibleContent>
        <p>折叠内容</p>
      </CollapsibleContent>
    </Collapsible>,
  )
}

const classes = (el: Element) => [...el.classList]

describe('行为', () => {
  it('默认收起,点击 trigger 展开,aria-expanded 联动', async () => {
    const w = harness()
    const trigger = w.querySelector('button')!
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(w.querySelector('[data-state="open"][role="region"]')).toBeNull()

    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(w.textContent).toContain('折叠内容')
  })

  it('defaultOpen 生效;disabled 时点击无效', async () => {
    const opened = harness({ defaultOpen: true })
    expect(opened.querySelector('button')!.getAttribute('aria-expanded')).toBe('true')

    const locked = harness({ disabled: true })
    fireEvent.click(locked.querySelector('button')!)
    expect(locked.querySelector('button')!.getAttribute('aria-expanded')).toBe('false')
  })

  it('受控 v-model:open', async () => {
    const open = { value: false, set: (_: boolean) => {} }
    function Harness() {
      const [value, setValue] = useState(false)
      open.value = value
      open.set = setValue
      return (
        <Collapsible open={value} onOpenChange={setValue}>
          <CollapsibleTrigger>开关</CollapsibleTrigger>
          <CollapsibleContent>
            <p>内容</p>
          </CollapsibleContent>
        </Collapsible>
      )
    }
    const w = mount(<Harness />)
    fireEvent.click(w.querySelector('button')!)
    expect(open.value).toBe(true)
    act(() => open.set(false))
    expect(w.querySelector('button')!.getAttribute('aria-expanded')).toBe('false')
  })

  it('默认自己渲染 Button 并自带展开指示物,调用方不用组合', () => {
    const w = harness()
    const btn = w.querySelector('button')!
    expect(classes(btn)).toContain('hn-interactive')
    expect(classes(btn)).toContain('group/hn-disclosure')

    const mark = btn.querySelector('span[aria-hidden="true"]')!
    expect(classes(mark)).toContain('hn-transition')
    expect(classes(mark)).toContain('group-data-open/hn-disclosure:rotate-180')
    expect(mark.querySelector('svg')).not.toBeNull()
  })

  it('icon 为 false 时不出指示物', () => {
    const w = mount(
      <Collapsible>
        <CollapsibleTrigger icon={false}>展开</CollapsibleTrigger>
        <CollapsibleContent>
          <p>内容</p>
        </CollapsibleContent>
      </Collapsible>,
    )
    expect(w.querySelector('button span[aria-hidden="true"]')).toBeNull()
  })

  it('icon 插槽只换字形,旋转仍由指示物负责', () => {
    const w = mount(
      <Collapsible>
        <CollapsibleTrigger icon={<i className="custom-glyph" />}>展开</CollapsibleTrigger>
        <CollapsibleContent>
          <p>内容</p>
        </CollapsibleContent>
      </Collapsible>,
    )
    const mark = w.querySelector('button span[aria-hidden="true"]')!
    expect(mark.querySelector('.custom-glyph')).not.toBeNull()
    expect(mark.querySelector('svg')).toBeNull()
    expect(classes(mark)).toContain('group-data-open/hn-disclosure:rotate-180')
  })

  it('trigger 支持 asChild 借体给项目 Button', async () => {
    const w = mount(
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" tone="neutral">
            借体开关
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>内容</p>
        </CollapsibleContent>
      </Collapsible>,
    )
    const btn = w.querySelector('button')!
    expect(classes(btn)).toContain('hn-interactive')
    fireEvent.click(btn)
    expect(btn.getAttribute('aria-expanded')).toBe('true')
  })

  it('content 挂上折叠动效并接通 reka 高度变量(defaultOpen 挂载时 reka 特意省略 data-state 以跳过入场动画)', async () => {
    const w = harness()
    fireEvent.click(w.querySelector('button')!)
    const content = w.querySelector('.hn-anim-collapse') as HTMLElement | null
    expect(content).not.toBeNull()
    expect(content!.getAttribute('data-state')).toBe('open')
    expect(content!.style.getPropertyValue('--hn-collapse-h')).toBe(
      'var(--radix-collapsible-content-height)',
    )
  })
})

describe('a11y', () => {
  it('无 a11y 违规(开合两态)', async () => {
    const closed = harness()
    await expectNoA11yViolations(closed.firstElementChild!)
    const opened = harness({ defaultOpen: true })
    await expectNoA11yViolations(opened.firstElementChild!)
  })
})
