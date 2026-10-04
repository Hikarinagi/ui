import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { renderToString } from 'react-dom/server'
import { DateRangeField, type DateRangeFieldProps } from './DateRangeField'
import type { DateRangeValue } from '../../../../shared/src/lib/date'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mountRange(modelValue: DateRangeValue | null, extra: DateRangeFieldProps = {}) {
  const changes = vi.fn()
  const clears = vi.fn()
  function Harness() {
    const [value, setValue] = useState<DateRangeValue | null>(modelValue)
    return (
      <DateRangeField
        aria-label="活动期间"
        {...extra}
        value={value}
        onValueChange={next => {
          changes(next)
          setValue(next)
        }}
        onClear={clears}
      />
    )
  }
  const { container } = render(<Harness />)
  return {
    container,
    changes,
    clears,
    host: () => container.querySelector('[data-hn-date-range-field]') as HTMLElement,
    group: () => container.querySelector('[role="group"]') as HTMLElement,
    spins: () => Array.from(container.querySelectorAll<HTMLElement>('[role="spinbutton"]')),
  }
}

describe('结构', () => {
  it('宿主是输入面，attrs 落在组元素上；起止两侧各自年月日，段的名称带起止前缀，中间是本地化分隔文字', () => {
    const w = mountRange(null, { className: 'w-96' })
    expect(w.host().classList).toContain('hn-field')
    expect(w.host().classList).toContain('w-96')
    expect(w.group().getAttribute('aria-label')).toBe('活动期间')
    const spins = w.spins()
    expect(spins.map(s => s.textContent)).toEqual(['年', '月', '日', '年', '月', '日'])
    expect(spins.map(s => s.getAttribute('aria-label'))).toEqual([
      '开始日期 年',
      '开始日期 月',
      '开始日期 日',
      '结束日期 年',
      '结束日期 月',
      '结束日期 日',
    ])
    expect(spins.every(s => s.getAttribute('data-placeholder') === '')).toBe(true)
    const separator = w.container.querySelector(
      '[role="group"] > span[aria-hidden="true"]:not([data-hn-segment])',
    )
    expect(separator?.textContent?.trim()).toBe('至')
  })

  it('v-model 是 { start, end } 的 ISO 字符串对：传入即填入两侧，方向键增减后仍以对象交出', () => {
    const w = mountRange({ start: '2026-09-01', end: '2026-09-30' })
    const spins = w.spins()
    expect(spins.map(s => s.getAttribute('aria-valuenow'))).toEqual([
      '2026',
      '9',
      '1',
      '2026',
      '9',
      '30',
    ])
    fireEvent.keyDown(spins[3]!, { key: 'ArrowUp' })
    expect(w.changes.mock.calls[0]).toEqual([{ start: '2026-09-01', end: '2027-09-30' }])
    fireEvent.keyDown(w.spins()[2]!, { key: 'ArrowUp' })
    expect(w.changes.mock.calls[1]).toEqual([{ start: '2026-09-02', end: '2027-09-30' }])
  })

  it('只填一侧时另一侧显示占位；清空仅有的一侧后值为 null', () => {
    const w = mountRange({ start: '2026-09-01', end: null })
    const spins = w.spins()
    expect(spins.slice(0, 3).map(s => s.getAttribute('aria-valuenow'))).toEqual(['2026', '9', '1'])
    expect(spins.slice(3).every(s => s.getAttribute('data-placeholder') === '')).toBe(true)
    fireEvent.keyDown(spins[2]!, { key: 'Backspace' })
    expect(w.changes.mock.calls[0]).toEqual([null])
  })

  it('granularity 为 minute 时两侧各多出时与分，交出的字符串到分', () => {
    const w = mountRange(
      { start: '2026-09-01T09:00', end: '2026-09-01T18:30' },
      { granularity: 'minute' },
    )
    const spins = w.spins()
    expect(spins).toHaveLength(10)
    fireEvent.keyDown(spins[9]!, { key: 'ArrowUp' })
    expect(w.changes.mock.calls[0]).toEqual([
      { start: '2026-09-01T09:00', end: '2026-09-01T18:31' },
    ])
  })

  it('结束早于开始、或者任一侧超出 min / max 时宿主带 data-invalid 且组元素 aria-invalid', () => {
    const reversed = mountRange({ start: '2026-09-30', end: '2026-09-01' })
    expect(reversed.host().getAttribute('data-invalid')).toBe('')
    expect(reversed.group().getAttribute('aria-invalid')).toBe('true')
    cleanup()
    const late = mountRange({ start: '2026-09-01', end: '2026-10-02' }, { max: '2026-09-30' })
    expect(late.host().getAttribute('data-invalid')).toBe('')
    cleanup()
    const fine = mountRange(
      { start: '2026-09-01', end: '2026-09-30' },
      { min: '2026-09-01', max: '2026-09-30' },
    )
    expect(fine.host().getAttribute('data-invalid')).toBeNull()
    cleanup()
    const flagged = mountRange(null, { invalid: true, disabled: true })
    expect(flagged.host().getAttribute('data-invalid')).toBe('')
    expect(flagged.host().getAttribute('data-disabled')).toBe('')
    expect(flagged.spins().every(s => s.getAttribute('data-disabled') === '')).toBe(true)
  })

  it('clearable 且有值时显示清除钮，点击后值为 null 并发 clear', async () => {
    const w = mountRange({ start: '2026-09-01', end: null }, { clearable: true })
    fireEvent.click(w.container.querySelector('button[aria-label="清除"]')!)
    expect(w.changes.mock.calls[0]).toEqual([null])
    expect(w.clears).toHaveBeenCalledTimes(1)
    await vi.waitFor(() =>
      expect(w.container.querySelector('button[aria-label="清除"]')).toBeNull(),
    )
  })
})

describe('服务端渲染', () => {
  it('首屏渲染出两侧各段的值，没有聚焦或者校验态', async () => {
    const html = renderToString(
      <DateRangeField value={{ start: '2026-09-01', end: '2026-09-30' }} aria-label="期间" />,
    )
    expect(html.match(/role="spinbutton"/g)).toHaveLength(6)
    expect(html).toContain('aria-valuenow="30"')
    expect(html).not.toContain('aria-invalid')
    expect(html).not.toContain('data-invalid')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountRange({ start: '2026-09-01', end: '2026-09-30' }, { clearable: true })
    await expectNoA11yViolations(w.container.firstElementChild!)
  })
})
