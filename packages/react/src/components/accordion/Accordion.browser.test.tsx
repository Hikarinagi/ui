import { describe, expect, it, vi, beforeEach } from 'vitest'
import { userEvent } from 'vitest/browser'
import type { AccordionProps } from './Accordion'
import { Accordion } from './Accordion'
import { AccordionItem } from './AccordionItem'
import { AccordionTrigger } from './AccordionTrigger'
import { AccordionContent } from './AccordionContent'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

async function harness(rootProps: AccordionProps = {}) {
  const w = await mount(
    <div style={{ width: '480px' }}>
      <Accordion {...rootProps}>
        {['a', 'b', 'c'].map(value => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>{`标题 ${value}`}</AccordionTrigger>
            <AccordionContent>
              <p style={{ height: '48px' }}>{`内容 ${value}`}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>,
  )
  return w.container
}

describe('accordion · 折叠列表', () => {
  it('展开走 hn-collapse-in，内容区从 0 长到自然高度；切换项时上一项收起', async () => {
    const w = await harness()
    const [a, b] = [...w.querySelectorAll('button')]
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    await userEvent.click(a!)
    const content = document.getElementById(a!.getAttribute('aria-controls')!) as HTMLElement
    await vi.waitFor(() => expect(getComputedStyle(content).animationName).toBe('hn-collapse-in'))
    await vi.waitFor(() => expect(content.getBoundingClientRect().height).toBe(48 + 16))

    await userEvent.click(b!)
    await vi.waitFor(() => expect(getComputedStyle(content).animationName).toBe('hn-collapse-out'))
    await vi.waitFor(() => expect(content.hidden).toBe(true))
    const other = document.getElementById(b!.getAttribute('aria-controls')!) as HTMLElement
    await vi.waitFor(() => expect(other.getBoundingClientRect().height).toBe(48 + 16))
  })

  it('触发器是整行：悬停落薄墨，按下不缩放，指示物随开合旋转', async () => {
    const w = await harness()
    const trigger = w.querySelector('button') as HTMLElement
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
    const w = await harness()
    const [a, b, c] = [...w.querySelectorAll('button')]
    a!.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(b)
    await userEvent.keyboard('{End}')
    expect(document.activeElement).toBe(c)
    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(b)
  })
})
