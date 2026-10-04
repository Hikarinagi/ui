import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { renderToString } from 'react-dom/server'
import { TimeField, type TimeFieldProps } from './TimeField'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mountTime(modelValue: string | null, extra: TimeFieldProps = {}) {
  const changes = vi.fn()
  const clears = vi.fn()
  function Harness() {
    const [value, setValue] = useState<string | null>(modelValue)
    return (
      <TimeField
        aria-label="开播时间"
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
    host: () => container.querySelector('[data-hn-time-field]') as HTMLElement,
    group: () => container.querySelector('[role="group"]') as HTMLElement,
    spins: () => Array.from(container.querySelectorAll<HTMLElement>('[role="spinbutton"]')),
  }
}

describe('结构', () => {
  it('宿主是输入面，attrs 落在各段的组元素上；中文下是时与分两段，空值时显示占位字样并带本地化名称', () => {
    const w = mountTime(null, { className: 'w-40' })
    expect(w.host().classList).toContain('hn-field')
    expect(w.host().classList).toContain('w-40')
    expect(w.group().getAttribute('aria-label')).toBe('开播时间')
    const spins = w.spins()
    expect(spins.map(s => s.getAttribute('aria-label'))).toEqual(['时', '分'])
    expect(spins.every(s => s.getAttribute('data-placeholder') === '')).toBe(true)
  })

  it('v-model 是 HH:mm 字符串：传入即填入各段，方向键增减后仍以字符串交出', () => {
    const w = mountTime('09:30')
    const spins = w.spins()
    expect(spins.map(s => s.getAttribute('aria-valuenow'))).toEqual(['9', '30'])
    fireEvent.keyDown(spins[0]!, { key: 'ArrowUp' })
    expect(w.changes.mock.calls[0]).toEqual(['10:30'])
    fireEvent.keyDown(w.spins()[1]!, { key: 'ArrowDown' })
    expect(w.changes.mock.calls[1]).toEqual(['10:29'])
  })

  it('granularity 为 second 时多出秒段，交出的字符串到秒；hour 只有时段', () => {
    const seconds = mountTime('09:30:15', { granularity: 'second' })
    expect(seconds.spins().map(s => s.getAttribute('aria-valuenow'))).toEqual(['9', '30', '15'])
    fireEvent.keyDown(seconds.spins()[2]!, { key: 'ArrowUp' })
    expect(seconds.changes.mock.calls[0]).toEqual(['09:30:16'])
    cleanup()
    const hours = mountTime('09:00', { granularity: 'hour' })
    expect(hours.spins()).toHaveLength(1)
    fireEvent.keyDown(hours.spins()[0]!, { key: 'ArrowUp' })
    expect(hours.changes.mock.calls[0]).toEqual(['10:00'])
  })

  it('minuteStep 让分段按步长增减', () => {
    const w = mountTime('09:30', { minuteStep: 15 })
    fireEvent.keyDown(w.spins()[1]!, { key: 'ArrowUp' })
    expect(w.changes.mock.calls[0]).toEqual(['09:45'])
  })

  it('超出 min 或者 max 时宿主带 data-invalid 且组元素 aria-invalid；invalid 与 disabled 各落各处', () => {
    const late = mountTime('23:00', { max: '18:00' })
    expect(late.host().getAttribute('data-invalid')).toBe('')
    expect(late.group().getAttribute('aria-invalid')).toBe('true')
    cleanup()
    const fine = mountTime('12:00', { min: '09:00', max: '18:00' })
    expect(fine.host().getAttribute('data-invalid')).toBeNull()
    cleanup()
    const flagged = mountTime('12:00', { invalid: true, disabled: true })
    expect(flagged.host().getAttribute('data-invalid')).toBe('')
    expect(flagged.host().getAttribute('data-disabled')).toBe('')
    expect(flagged.spins().every(s => s.getAttribute('data-disabled') === '')).toBe(true)
  })

  it('clearable 且有值时显示清除钮，点击清空并发 clear', async () => {
    const w = mountTime('09:30', { clearable: true })
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
    const html = renderToString(<TimeField value="09:30" aria-label="时间" />)
    expect(html.match(/role="spinbutton"/g)).toHaveLength(2)
    expect(html).toContain('aria-valuenow="30"')
    expect(html).not.toContain('aria-invalid')
    expect(html).not.toContain('data-invalid')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountTime('09:30', { clearable: true })
    await expectNoA11yViolations(w.container.firstElementChild!)
  })
})
