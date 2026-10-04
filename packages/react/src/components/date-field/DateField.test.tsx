import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { renderToString } from 'react-dom/server'
import { DateField, type DateFieldProps } from './DateField'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(props: DateFieldProps & { model?: boolean } = {}) {
  const changes = vi.fn()
  const clears = vi.fn()
  const { model = false, ...rest } = props
  function Harness() {
    const [value, setValue] = useState<string | null | undefined>(rest.value)
    return (
      <DateField
        {...rest}
        value={value}
        onValueChange={next => {
          changes(next)
          if (model) setValue(next)
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
    host: () => container.querySelector('[data-hn-date-field]') as HTMLElement,
    group: () => container.querySelector('[role="group"]') as HTMLElement,
    spins: () => Array.from(container.querySelectorAll<HTMLElement>('[role="spinbutton"]')),
  }
}

describe('结构', () => {
  it('宿主是输入面，attrs 落在各段的组元素上；中文下分段顺序是年月日，空值时各段显示占位字样并带本地化名称', () => {
    const w = mount({ value: null, className: 'w-72', 'aria-label': '发布日期' })
    expect(w.host().classList).toContain('hn-field')
    expect(w.host().classList).toContain('w-72')
    expect(w.group().getAttribute('aria-label')).toBe('发布日期')
    const spins = w.spins()
    expect(spins.map(s => s.textContent)).toEqual(['年', '月', '日'])
    expect(spins.map(s => s.getAttribute('aria-label'))).toEqual(['年', '月', '日'])
    expect(spins.every(s => s.getAttribute('data-placeholder') === '')).toBe(true)
    expect(
      Array.from(w.container.querySelectorAll('[data-hn-segment][aria-hidden="true"]')).map(
        s => s.textContent,
      ),
    ).toEqual(['/', '/'])
  })

  it('v-model 是 ISO 字符串：传入即填入各段，方向键增减后仍以字符串交出', async () => {
    const w = mount({ value: '2026-09-04', model: true })
    const spins = w.spins()
    expect(spins.map(s => s.getAttribute('aria-valuenow'))).toEqual(['2026', '9', '4'])
    fireEvent.keyDown(spins[0]!, { key: 'ArrowUp' })
    expect(w.changes.mock.calls[0]).toEqual(['2027-09-04'])
    fireEvent.keyDown(w.spins()[2]!, { key: 'ArrowDown' })
    expect(w.changes.mock.calls[1]).toEqual(['2027-09-03'])
    await vi.waitFor(() =>
      expect(w.spins().map(s => s.getAttribute('aria-valuenow'))).toEqual(['2027', '9', '3']),
    )
  })

  it('granularity 为 minute 时多出时与分两段，交出的字符串到分', async () => {
    const w = mount({ value: '2026-09-04T10:30', granularity: 'minute' })
    const spins = w.spins()
    expect(spins.map(s => s.getAttribute('aria-valuenow'))).toEqual(['2026', '9', '4', '10', '30'])
    fireEvent.keyDown(spins[4]!, { key: 'ArrowUp' })
    expect(w.changes.mock.calls[0]).toEqual(['2026-09-04T10:31'])
  })

  it('超出 min 或者 max 时宿主带 data-invalid 且组元素 aria-invalid；invalid 与 disabled 各落各处', () => {
    const late = mount({ value: '2026-09-04', max: '2026-09-01' })
    expect(late.host().getAttribute('data-invalid')).toBe('')
    expect(late.group().getAttribute('aria-invalid')).toBe('true')
    cleanup()
    const fine = mount({ value: '2026-09-04', min: '2026-09-01', max: '2026-09-30' })
    expect(fine.host().getAttribute('data-invalid')).toBeNull()
    cleanup()
    const flagged = mount({ value: '2026-09-04', invalid: true, disabled: true })
    expect(flagged.host().getAttribute('data-invalid')).toBe('')
    expect(flagged.host().getAttribute('data-disabled')).toBe('')
    expect(flagged.spins().every(s => s.getAttribute('data-disabled') === '')).toBe(true)
  })

  it('clearable 且有值时显示清除钮，点击清空并发 clear', async () => {
    const w = mount({ value: '2026-09-04', clearable: true, model: true })
    fireEvent.click(w.container.querySelector('button[aria-label="清除"]')!)
    expect(w.changes.mock.calls[0]).toEqual([null])
    expect(w.clears).toHaveBeenCalledTimes(1)
    await vi.waitFor(() =>
      expect(w.container.querySelector('button[aria-label="清除"]')).toBeNull(),
    )
  })
})

describe('服务端渲染', () => {
  it('首屏渲染出各段的值，没有聚焦或者校验态', async () => {
    const html = renderToString(<DateField value="2026-09-04" aria-label="日期" />)
    expect(html.match(/role="spinbutton"/g)).toHaveLength(3)
    expect(html).toContain('aria-valuenow="2026"')
    expect(html).not.toContain('aria-invalid')
    expect(html).not.toContain('data-invalid')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const { container } = render(<DateField value="2026-09-04" clearable aria-label="发布日期" />)
    await expectNoA11yViolations(container.firstElementChild!)
  })
})
