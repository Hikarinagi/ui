import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { DatePicker, type DatePickerProps } from './DatePicker'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mountPicker(props: DatePickerProps = {}, model = false) {
  const changes = vi.fn()
  const opens = vi.fn()
  const clears = vi.fn()
  function Harness() {
    const [value, setValue] = useState(props.value)
    const [open, setOpen] = useState(props.open)
    return (
      <DatePicker
        {...props}
        value={value}
        open={open}
        onValueChange={next => {
          changes(next)
          if (model) setValue(next)
        }}
        onOpenChange={next => {
          opens(next)
          if (model) setOpen(next)
        }}
        onClear={clears}
      />
    )
  }
  const { container } = render(<Harness />)
  return { container, changes, opens, clears }
}

describe('结构', () => {
  it('宿主是输入面，里面是嵌入的日期段与打开日历的按钮；attrs 落在段的组元素上', () => {
    const w = mountPicker({ value: '2026-09-04', className: 'w-72', 'aria-label': '发布日期' })
    const host = w.container.querySelector('[data-hn-date-picker]')!
    expect(host.classList).toContain('hn-field')
    expect(host.classList).toContain('w-72')
    expect(w.container.querySelector('[data-hn-date-field]')!.classList).not.toContain('hn-field')
    expect(w.container.querySelector('[role="group"]')!.getAttribute('aria-label')).toBe('发布日期')
    expect(
      Array.from(w.container.querySelectorAll('[role="spinbutton"]')).map(s =>
        s.getAttribute('aria-valuenow'),
      ),
    ).toEqual(['2026', '9', '4'])
    const toggle = w.container.querySelector('button[aria-label="打开日历"]')!
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
  })

  it('disabled 与 invalid 落在宿主并传给段与按钮', () => {
    const w = mountPicker({ value: '2026-09-04', disabled: true, invalid: true })
    expect(w.container.querySelector('[data-hn-date-picker]')!.getAttribute('data-invalid')).toBe(
      '',
    )
    expect(
      w.container.querySelector('button[aria-label="打开日历"]')!.hasAttribute('disabled'),
    ).toBe(true)
    expect(w.container.querySelector('[role="group"]')!.getAttribute('aria-invalid')).toBe('true')
    expect(
      Array.from(w.container.querySelectorAll('[role="spinbutton"]')).every(
        s => s.getAttribute('data-disabled') === '',
      ),
    ).toBe(true)
  })
})

describe('交互', () => {
  it('点按钮打开日历，选中一天即写回并关闭；v-model:open 同步', async () => {
    const w = mountPicker({ value: '2026-09-04' }, true)
    fireEvent.click(w.container.querySelector('button[aria-label="打开日历"]')!)
    expect(w.opens.mock.calls[0]).toEqual([true])
    const day = await vi.waitFor(() => {
      const found = document.querySelector(
        '[data-hn-calendar] [data-value="2026-09-10"]',
      ) as HTMLElement
      expect(found).not.toBeNull()
      return found
    })
    expect(
      document.querySelector('[data-hn-calendar] [data-selected]')?.getAttribute('data-value'),
    ).toBe('2026-09-04')
    await act(async () => day.click())
    expect(w.changes.mock.calls[0]).toEqual(['2026-09-10'])
    expect(w.opens.mock.calls[1]).toEqual([false])
  })

  it('清除钮清空值并发 clear，日历不打开', () => {
    const w = mountPicker({ value: '2026-09-04', clearable: true })
    fireEvent.click(w.container.querySelector('button[aria-label="清除"]')!)
    expect(w.changes.mock.calls[0]).toEqual([null])
    expect(w.clears).toHaveBeenCalledTimes(1)
    expect(w.opens).not.toHaveBeenCalled()
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountPicker({ value: '2026-09-04', clearable: true, 'aria-label': '发布日期' })
    await expectNoA11yViolations(w.container.firstElementChild!)
  })
})
