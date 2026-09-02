import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import Chip from './Chip.vue'
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
  document.body.appendChild(host)
  return host
}

function mountChip(
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = { default: () => '科幻' },
) {
  const w = mount(Chip, { props, slots, attachTo: attach() })
  mounted.push(w)
  return w
}

function el(w: VueWrapper) {
  return w.element as HTMLElement
}

function track(w: VueWrapper) {
  return el(w).querySelector('.grid') as HTMLElement
}

describe('chip · 尺寸与形态', () => {
  it('md 取 control-h-sm 28，sm 低一档 24，恒胶囊', () => {
    const md = el(mountChip())
    expect(md.offsetHeight).toBe(28)
    expect(parseFloat(getComputedStyle(md).borderTopLeftRadius)).toBeGreaterThanOrEqual(14)
    expect(el(mountChip({ size: 'sm' })).offsetHeight).toBe(24)
  })

  it('outline 有可见边框、透明底，与 soft 同高', () => {
    const soft = el(mountChip())
    const outline = el(mountChip({ variant: 'outline' }))
    const cs = getComputedStyle(outline)
    expect(cs.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(cs.borderTopColor).not.toMatch(/rgba\(.*0\)$/)
    expect(getComputedStyle(soft).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(outline.offsetHeight).toBe(soft.offsetHeight)
  })

  it('移除按钮随档位：md 20、sm 16', () => {
    const md = el(mountChip({ removable: true })).querySelector('button') as HTMLElement
    const sm = el(mountChip({ removable: true, size: 'sm' })).querySelector('button') as HTMLElement
    expect(md.offsetHeight).toBe(20)
    expect(sm.offsetHeight).toBe(16)
  })
})

describe('chip · 可选中', () => {
  it('Tab 聚焦，Space 切换，选中后勾选出现、着选中墨与强调字色', async () => {
    const w = mountChip({ selectable: true })
    await userEvent.tab()
    expect(document.activeElement).toBe(el(w))

    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(el(w).getAttribute('aria-pressed')).toBe('true'))
    expect(w.emitted('update:selected')?.[0]).toEqual([true])
    expect(w.find('svg').exists()).toBe(true)

    await vi.waitFor(() =>
      expect(parseFloat(getComputedStyle(el(w), '::after').opacity)).toBeGreaterThan(0),
    )
    const accent = el(mountChip({ tone: 'accent' }))
    await vi.waitFor(() =>
      expect(getComputedStyle(el(w)).color).toBe(getComputedStyle(accent).color),
    )
    expect(getComputedStyle(el(mountChip())).color).not.toBe(getComputedStyle(accent).color)
  })

  it('勾选位从零宽展开，取消后收回', async () => {
    const w = mountChip({ selectable: true })
    expect(track(w).getBoundingClientRect().width).toBe(0)

    await w.setProps({ selected: true })
    await vi.waitFor(() => expect(track(w).getBoundingClientRect().width).toBeGreaterThan(10))

    await w.setProps({ selected: false })
    await vi.waitFor(() => expect(track(w).getBoundingClientRect().width).toBe(0))
  })

  it('带 icon 时图标位宽度不变，图标与勾选交接', async () => {
    const w = mountChip(
      { selectable: true },
      { default: () => '科幻', icon: () => h('svg', { 'data-probe': '' }) },
    )
    const before = track(w).getBoundingClientRect().width
    expect(before).toBeGreaterThan(10)

    await w.setProps({ selected: true })
    await vi.waitFor(() => expect(w.findAll('svg')).toHaveLength(2))
    expect(track(w).getBoundingClientRect().width).toBe(before)
    const icon = w.find('[data-probe]').element.parentElement as HTMLElement
    await vi.waitFor(() => expect(parseFloat(getComputedStyle(icon).opacity)).toBe(0))
  })

  it('disabled 不进 tab 序列，点击不切换', async () => {
    const disabled = mountChip({ selectable: true, disabled: true })
    const reachable = mountChip({ selectable: true })
    await userEvent.tab()
    expect(document.activeElement).toBe(el(reachable))

    await userEvent.click(el(disabled), { force: true })
    expect(disabled.emitted('update:selected')).toBeUndefined()
  })
})

describe('chip · 可移除', () => {
  it('根不可聚焦，Tab 落在移除按钮，Enter 与 Backspace 都触发 remove', async () => {
    const w = mountChip({ removable: true })
    await userEvent.tab()
    const remove = el(w).querySelector('button') as HTMLElement
    expect(document.activeElement).toBe(remove)

    await userEvent.keyboard('{Enter}')
    expect(w.emitted('remove')).toHaveLength(1)

    await userEvent.keyboard('{Backspace}')
    expect(w.emitted('remove')).toHaveLength(2)
  })

  it('点击移除按钮不冒泡为条目点击', async () => {
    const onClick = vi.fn()
    const w = mountChip({ removable: true, onClick })
    await userEvent.click(el(w).querySelector('button') as HTMLElement)
    expect(w.emitted('remove')).toHaveLength(1)
    expect(onClick).not.toHaveBeenCalled()
  })
})
