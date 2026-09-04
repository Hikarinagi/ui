import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import Calendar from './Calendar.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'padding: 40px'
  document.body.appendChild(host)
  return host
}

function mountCalendar(props: Record<string, unknown> = {}) {
  const state = reactive<{ modelValue: string | null }>({ modelValue: '2026-09-04' })
  const w = mount(
    defineComponent({
      render: () =>
        h(Calendar, {
          ...state,
          ...props,
          'onUpdate:modelValue': (value: string | null) => (state.modelValue = value),
        }),
    }),
    { attachTo: attach(), global: { stubs: { transition: false } } },
  )
  mounted.push(w)
  const root = w.find('[data-hn-calendar]').element as HTMLElement
  return {
    state,
    root,
    day: (date: string) => root.querySelector(`[data-value="${date}"]`) as HTMLElement,
  }
}

describe('calendar · 键盘', () => {
  it('Tab 落在选中格；方向键按天与周移动焦点，Enter 选中；焦点环只在键盘下出现', async () => {
    const { state, root, day } = mountCalendar()
    const before = document.createElement('button')
    document.body.prepend(before)
    before.focus()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await vi.waitFor(() => expect(document.activeElement).toBe(day('2026-09-04')))
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(document.activeElement).toBe(day('2026-09-05')))
    expect(getComputedStyle(day('2026-09-05')).outlineStyle).toBe('solid')
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement).toBe(day('2026-09-12')))
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(state.modelValue).toBe('2026-09-12'))
    await userEvent.click(day('2026-09-20'))
    await vi.waitFor(() => expect(state.modelValue).toBe('2026-09-20'))
    expect(getComputedStyle(day('2026-09-20')).outlineStyle).toBe('none')
    expect(root.contains(document.activeElement)).toBe(true)
  })
})

describe('calendar · 翻页与几何', () => {
  it('上下月按钮翻页，标题随之变化；固定六周使不同月份的高度相同；日格是控件小档的正方形', async () => {
    const { root } = mountCalendar()
    const height = root.offsetHeight
    const cell = root.querySelector('[data-value="2026-09-04"]') as HTMLElement
    const raw = getComputedStyle(cell).getPropertyValue('--hn-control-h-md').trim()
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const side = raw.endsWith('rem') ? parseFloat(raw) * rem : parseFloat(raw)
    expect(cell.offsetWidth).toBe(cell.offsetHeight)
    expect(cell.offsetHeight).toBe(side)
    const plain = root.querySelector('[data-value="2026-09-05"]') as HTMLElement
    expect(getComputedStyle(cell).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(plain).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(cell).color).not.toBe(getComputedStyle(plain).color)
    await userEvent.click(root.querySelector('button[aria-label="下个月"]')!)
    await vi.waitFor(() => expect(root.querySelector('[data-value="2026-10-01"]')).not.toBeNull())
    expect(root.textContent).toContain('2026年10月')
    expect(root.offsetHeight).toBe(height)
    await userEvent.click(root.querySelector('button[aria-label="上个月"]')!)
    await userEvent.click(root.querySelector('button[aria-label="上个月"]')!)
    await vi.waitFor(() => expect(root.querySelector('[data-value="2026-08-01"]')).not.toBeNull())
    expect(root.offsetHeight).toBe(height)
  })
})

describe('calendar · 年月视图', () => {
  it('进入月份视图时焦点落在当前月，三种视图的宽高相同；选中一个月后焦点回到日格', async () => {
    const { root } = mountCalendar()
    const width = root.offsetWidth
    const height = root.offsetHeight
    await userEvent.click(root.querySelector('button[aria-label="选择月份"]')!)
    await vi.waitFor(() =>
      expect(document.activeElement).toBe(
        root.querySelector('[data-reka-month-picker-cell-trigger][data-value="2026-09-01"]'),
      ),
    )
    await vi.waitFor(() => expect(root.offsetHeight).toBe(height))
    expect(root.offsetWidth).toBe(width)
    await userEvent.click(root.querySelector('button[aria-label="选择年份"]')!)
    await vi.waitFor(() =>
      expect(document.activeElement).toBe(
        root.querySelector('[data-reka-year-picker-cell-trigger][data-value="2026-01-01"]'),
      ),
    )
    await vi.waitFor(() => expect(root.offsetHeight).toBe(height))
    expect(root.offsetWidth).toBe(width)
    await userEvent.keyboard('{ArrowRight}{Enter}')
    await vi.waitFor(() => expect(root.getAttribute('data-level')).toBe('month'))
    await vi.waitFor(() =>
      expect(document.activeElement?.getAttribute('data-value')).toBe('2027-09-01'),
    )
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(root.getAttribute('data-level')).toBe('day'))
    await vi.waitFor(() =>
      expect(document.activeElement).toBe(root.querySelector('[data-value="2027-09-04"]')),
    )
    expect(root.offsetHeight).toBe(height)
  })
})

describe('calendar · 尺寸', () => {
  it('三档日格边长分别等于三档控件高度，翻页按钮同档', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const { root } = mountCalendar({ size })
      const cell = root.querySelector('[data-value="2026-09-04"]') as HTMLElement
      const raw = getComputedStyle(cell).getPropertyValue(`--hn-control-h-${size}`).trim()
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const side = raw.endsWith('rem') ? parseFloat(raw) * rem : parseFloat(raw)
      expect(cell.offsetHeight).toBe(side)
      expect(cell.offsetWidth).toBe(side)
      expect((root.querySelector('button[aria-label="上个月"]') as HTMLElement).offsetHeight).toBe(
        side,
      )
    }
  })
})
