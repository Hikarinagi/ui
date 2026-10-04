import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { useState } from 'react'
import { Calendar, type CalendarProps } from './Calendar'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(props: Partial<CalendarProps> = {}) {
  const container = render(<Calendar {...props} />).container
  return wrap(container)
}

function wrap(container: HTMLElement) {
  return {
    container,
    find: (selector: string) => container.querySelector(selector) as HTMLElement | null,
    findAll: (selector: string) => Array.from(container.querySelectorAll<HTMLElement>(selector)),
  }
}

type Wrapper = ReturnType<typeof wrap>

const headOf = (w: Wrapper) => w.findAll('th').map(th => th.textContent?.trim())
const daysOf = (w: Wrapper) => w.findAll('[data-radix-calendar-cell-trigger]')
const dayOf = (w: Wrapper, date: string) => w.find(`[data-value="${date}"]`)!

describe('结构', () => {
  it('中文下一周从周一开始、表头是一到日的窄格式；固定六周共 42 格；标题与根的名称按语言生成', () => {
    const w = mount({ placeholder: '2026-09-04' })
    expect(headOf(w)).toEqual(['一', '二', '三', '四', '五', '六', '日'])
    expect(daysOf(w)).toHaveLength(42)
    expect(w.find('[data-hn-calendar]')!.getAttribute('aria-label')).toBe('日历, 2026年9月')
    expect(w.find('button[aria-label="上个月"]')).not.toBeNull()
    expect(w.find('button[aria-label="下个月"]')).not.toBeNull()
    expect(dayOf(w, '2026-08-31').getAttribute('data-outside-view')).toBe('')
    expect(dayOf(w, '2026-09-01').getAttribute('data-outside-view')).toBeNull()
  })

  it('weekStartsOn 与 weekdayFormat 改变表头', () => {
    const w = mount({ placeholder: '2026-09-04', weekStartsOn: 0, weekdayFormat: 'short' })
    expect(headOf(w)[0]).toBe('周日')
  })
})

describe('值', () => {
  it('v-model 是 ISO 字符串：选中的格带 data-selected 并承接焦点停靠，点击另一格交出新字符串', () => {
    const onValueChange = vi.fn()
    const w = mount({ value: '2026-09-04', onValueChange })
    expect(dayOf(w, '2026-09-04').getAttribute('data-selected')).toBe('true')
    expect(dayOf(w, '2026-09-04').getAttribute('tabindex')).toBe('0')
    expect(dayOf(w, '2026-09-05').getAttribute('tabindex')).toBe('-1')
    fireEvent.click(dayOf(w, '2026-09-05'))
    expect(onValueChange.mock.calls[0]).toEqual(['2026-09-05'])
  })

  it('min 与 max 之外的格禁用；unavailable 以 ISO 字符串判定并划去', () => {
    const w = mount({
      value: '2026-09-04',
      min: '2026-09-02',
      max: '2026-09-20',
      unavailable: (date: string) => date === '2026-09-10',
    })
    expect(dayOf(w, '2026-09-01').getAttribute('data-disabled')).toBe('')
    expect(dayOf(w, '2026-09-21').getAttribute('data-disabled')).toBe('')
    expect(dayOf(w, '2026-09-02').getAttribute('data-disabled')).toBeNull()
    expect(dayOf(w, '2026-09-10').getAttribute('data-unavailable')).toBe('')
    expect(dayOf(w, '2026-09-10').getAttribute('aria-disabled')).toBe('true')
  })

  it('readonly 时点击不改值；disabled 落在根上', () => {
    const onValueChange = vi.fn()
    const w = mount({ value: '2026-09-04', readonly: true, onValueChange })
    fireEvent.click(dayOf(w, '2026-09-05'))
    expect(onValueChange).not.toHaveBeenCalled()
    const off = mount({ value: '2026-09-04', disabled: true })
    expect(off.findAll('[data-hn-calendar]').at(-1)!.getAttribute('data-disabled')).toBe('')
  })
})

describe('服务端渲染', () => {
  it('首屏渲染出整月网格与选中格', () => {
    const html = renderToString(<Calendar value="2026-09-04" />)
    expect(html.match(/data-radix-calendar-cell-trigger/g)).toHaveLength(42)
    expect(html).toContain('data-value="2026-09-04"')
    expect(html.match(/data-selected="true"/g)).toHaveLength(1)
  })
})

describe('显示的月份', () => {
  it('翻页后以 update:placeholder 交出新视图的日期；父级改 placeholder 即切换显示的月份', () => {
    const emitted: (string | undefined)[] = []
    let setPlaceholder: (value: string | undefined) => void = () => {}
    function Harness() {
      const [placeholder, set] = useState<string | undefined>('2026-09-01')
      setPlaceholder = set
      return (
        <Calendar
          placeholder={placeholder}
          onPlaceholderChange={value => {
            emitted.push(value)
            set(value)
          }}
        />
      )
    }
    const w = wrap(render(<Harness />).container)
    fireEvent.click(w.find('button[aria-label="下个月"]')!)
    expect(emitted.at(-1)).toEqual('2026-10-01')
    expect(dayOf(w, '2026-10-15')).not.toBeNull()
    act(() => setPlaceholder('2026-12-20'))
    expect(w.find('button[aria-label="选择月份"]')!.textContent).toBe('2026年12月')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount({ value: '2026-09-04' })
    await expectNoA11yViolations(w.container)
  })
})

describe('年月切换', () => {
  it('点击标题进入月份视图：十二个月、当前月选中；点一个月回到日视图并翻到该月；月份视图的标题进入年份视图，点一年换年后回到月份视图', async () => {
    const onValueChange = vi.fn()
    const w = mount({ value: '2026-09-04', onValueChange })
    const root = w.find('[data-hn-calendar]')!
    expect(root.getAttribute('data-level')).toBe('day')
    fireEvent.click(w.find('button[aria-label="选择月份"]')!)
    expect(root.getAttribute('data-level')).toBe('month')
    await vi.waitFor(() =>
      expect(w.findAll('[data-radix-month-picker-cell-trigger]')).toHaveLength(12),
    )
    expect(
      w
        .find('[data-radix-month-picker-cell-trigger][data-value="2026-09-01"]')!
        .getAttribute('data-selected'),
    ).toBe('true')
    expect(w.find('button[aria-label="选择年份"]')!.textContent).toBe('2026年')
    fireEvent.click(w.find('button[aria-label="选择年份"]')!)
    expect(root.getAttribute('data-level')).toBe('year')
    await vi.waitFor(() =>
      expect(w.findAll('[data-radix-year-picker-cell-trigger]')).toHaveLength(12),
    )
    const years = w.findAll('[data-radix-year-picker-cell-trigger]')
    expect(years[0]!.getAttribute('data-value')).toBe('2020-01-01')
    fireEvent.click(w.find('[data-radix-year-picker-cell-trigger][data-value="2028-01-01"]')!)
    expect(root.getAttribute('data-level')).toBe('month')
    await vi.waitFor(() =>
      expect(w.find('button[aria-label="选择年份"]')?.textContent).toBe('2028年'),
    )
    fireEvent.click(w.find('[data-radix-month-picker-cell-trigger][data-value="2028-03-01"]')!)
    expect(root.getAttribute('data-level')).toBe('day')
    await vi.waitFor(() =>
      expect(w.find('button[aria-label="选择月份"]')?.textContent).toBe('2028年3月'),
    )
    expect(w.find('[data-value="2028-03-01"]')).not.toBeNull()
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('Esc 逐级返回，不冒泡到外面', async () => {
    const w = mount({ value: '2026-09-04' })
    fireEvent.click(w.find('button[aria-label="选择月份"]')!)
    await vi.waitFor(() => expect(w.find('button[aria-label="选择年份"]')).not.toBeNull())
    fireEvent.click(w.find('button[aria-label="选择年份"]')!)
    const root = w.find('[data-hn-calendar]')!
    await vi.waitFor(() => expect(w.find('[data-radix-year-picker-cell-trigger]')).not.toBeNull())
    fireEvent.keyDown(w.find('[data-radix-year-picker-cell-trigger]')!, { key: 'Escape' })
    expect(root.getAttribute('data-level')).toBe('month')
    await vi.waitFor(() => expect(w.find('[data-radix-month-picker-cell-trigger]')).not.toBeNull())
    fireEvent.keyDown(w.find('[data-radix-month-picker-cell-trigger]')!, { key: 'Escape' })
    expect(root.getAttribute('data-level')).toBe('day')
  })
})
