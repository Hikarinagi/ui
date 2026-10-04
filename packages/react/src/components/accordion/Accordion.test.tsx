import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { Accordion, type AccordionProps } from './Accordion'
import { AccordionItem } from './AccordionItem'
import { AccordionTrigger, type AccordionTriggerProps } from './AccordionTrigger'
import { AccordionContent } from './AccordionContent'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function harness(
  rootProps: AccordionProps = {},
  items: Array<{
    value: string
    disabled?: boolean
    trigger?: Pick<AccordionTriggerProps, 'level' | 'icon'>
  }> = [{ value: 'a' }, { value: 'b' }],
) {
  const { container } = render(
    <Accordion {...rootProps}>
      {items.map(item => (
        <AccordionItem key={item.value} value={item.value} disabled={item.disabled}>
          <AccordionTrigger {...item.trigger}>{`标题 ${item.value}`}</AccordionTrigger>
          <AccordionContent>
            <p>{`内容 ${item.value}`}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>,
  )
  return container
}

function triggers(w: HTMLElement) {
  return [...w.querySelectorAll('button')]
}

const classes = (el: Element) => [...el.classList]

describe('结构与语义', () => {
  it('触发器是 h3 里的按钮，带展开指示物，内容区默认收起', () => {
    const w = harness()
    const heading = w.querySelector('h3')
    expect(heading).not.toBeNull()
    const btn = heading!.querySelector('button')!
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    expect(btn.querySelector('svg')).not.toBeNull()
    expect(classes(btn)).toContain('hn-state-layer')
    expect(classes(btn)).toContain('hn-press-none')
    expect(w.textContent).not.toContain('内容 a')
  })

  it('level 换标题层级，icon 为 false 时不出指示物', () => {
    const w = harness({}, [{ value: 'a', trigger: { level: 2, icon: false } }])
    expect(w.querySelector('h2')).not.toBeNull()
    expect(w.querySelector('h3')).toBeNull()
    expect(w.querySelector('button svg')).toBeNull()
  })

  it('single 模式一次只展开一项，再点同一项默认不收起', async () => {
    const w = harness()
    const [a, b] = triggers(w)
    fireEvent.click(a!)
    expect(a!.getAttribute('aria-expanded')).toBe('true')
    expect(w.textContent).toContain('内容 a')

    fireEvent.click(b!)
    expect(b!.getAttribute('aria-expanded')).toBe('true')
    expect(a!.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(b!)
    expect(b!.getAttribute('aria-expanded')).toBe('true')
  })

  it('collapsible 允许收起当前项；multiple 允许多项同时展开', async () => {
    const single = harness({ collapsible: true })
    fireEvent.click(triggers(single)[0]!)
    fireEvent.click(triggers(single)[0]!)
    expect(triggers(single)[0]!.getAttribute('aria-expanded')).toBe('false')

    const multiple = harness({ type: 'multiple' })
    fireEvent.click(triggers(multiple)[0]!)
    fireEvent.click(triggers(multiple)[1]!)
    expect(triggers(multiple)[0]!.getAttribute('aria-expanded')).toBe('true')
    expect(triggers(multiple)[1]!.getAttribute('aria-expanded')).toBe('true')
  })

  it('defaultValue 指定初始展开项，v-model 回写', async () => {
    const w = harness({ defaultValue: 'b' })
    expect(triggers(w)[1]!.getAttribute('aria-expanded')).toBe('true')

    const values: unknown[] = []
    const controlled = harness({
      value: 'a',
      onValueChange: v => values.push(v),
    })
    fireEvent.click(triggers(controlled)[1]!)
    expect(values).toEqual(['b'])
  })

  it('禁用项的触发器不可用', () => {
    const w = harness({}, [{ value: 'a', disabled: true }, { value: 'b' }])
    expect(triggers(w)[0]!.getAttribute('disabled')).not.toBeNull()
    expect(triggers(w)[1]!.getAttribute('disabled')).toBeNull()
  })

  it('无障碍零违例', async () => {
    const w = harness({ defaultValue: 'a' })
    await expectNoA11yViolations(w.firstElementChild!)
  })
})
