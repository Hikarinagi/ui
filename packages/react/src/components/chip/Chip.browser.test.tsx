import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from 'vitest/browser'
import type { ReactNode } from 'react'
import { Chip, type ChipProps } from './Chip'
import { mount } from '../../../test/mount'
import { signal, tick, type Signal } from '../../../test/signal'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> }> = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

interface Mounted {
  element: HTMLElement
  onSelectedChange: ReturnType<typeof vi.fn>
  onRemove: ReturnType<typeof vi.fn>
  selected?: Signal<boolean>
}

async function mountChip(
  props: Partial<ChipProps> = {},
  children: ReactNode = '科幻',
  selected?: Signal<boolean>,
): Promise<Mounted> {
  const onSelectedChange = vi.fn()
  const onRemove = vi.fn()
  function Harness() {
    const value = selected?.use()
    return (
      <Chip
        {...props}
        {...(selected ? { selected: value } : {})}
        onSelectedChange={onSelectedChange}
        onRemove={onRemove}
      >
        {children}
      </Chip>
    )
  }
  const w = await mount(<Harness />)
  mounted.push(w)
  return { element: w.element, onSelectedChange, onRemove, selected }
}

function track(w: Mounted) {
  return w.element.querySelector('[data-hn-icon]') as HTMLElement
}

describe('chip · 尺寸与形态', () => {
  it('md 取 control-h-sm 28，sm 低一档 24，恒胶囊', async () => {
    const md = (await mountChip()).element
    expect(md.offsetHeight).toBe(28)
    expect(parseFloat(getComputedStyle(md).borderTopLeftRadius)).toBeGreaterThanOrEqual(14)
    expect((await mountChip({ size: 'sm' })).element.offsetHeight).toBe(24)
  })

  it('outline 有可见边框、透明底，与 soft 同高', async () => {
    const soft = (await mountChip()).element
    const outline = (await mountChip({ variant: 'outline' })).element
    const cs = getComputedStyle(outline)
    expect(cs.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(cs.borderTopColor).not.toMatch(/rgba\(.*0\)$/)
    expect(getComputedStyle(soft).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(outline.offsetHeight).toBe(soft.offsetHeight)
  })

  it('移除按钮随档位：md 20、sm 16', async () => {
    const md = (await mountChip({ removable: true })).element.querySelector('button') as HTMLElement
    const sm = (await mountChip({ removable: true, size: 'sm' })).element.querySelector(
      'button',
    ) as HTMLElement
    expect(md.offsetHeight).toBe(20)
    expect(sm.offsetHeight).toBe(16)
  })
})

describe('chip · 可选中', () => {
  it('Tab 聚焦，Space 切换，选中后勾选出现、着选中墨与强调字色', async () => {
    const w = await mountChip({ selectable: true })
    await userEvent.tab()
    expect(document.activeElement).toBe(w.element)

    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(w.element.getAttribute('aria-pressed')).toBe('true'))
    expect(w.onSelectedChange.mock.calls[0]).toEqual([true])
    expect(w.element.querySelector('svg')).not.toBeNull()

    await vi.waitFor(() =>
      expect(parseFloat(getComputedStyle(w.element, '::after').opacity)).toBeGreaterThan(0),
    )
    const accent = (await mountChip({ tone: 'accent' })).element
    await vi.waitFor(() =>
      expect(getComputedStyle(w.element).color).toBe(getComputedStyle(accent).color),
    )
    expect(getComputedStyle((await mountChip()).element).color).not.toBe(
      getComputedStyle(accent).color,
    )
  })

  it('勾选位从零宽展开，取消后收回', async () => {
    const w = await mountChip({ selectable: true }, '科幻', signal(false))
    expect(track(w).getBoundingClientRect().width).toBe(0)

    w.selected!.value = true
    await tick()
    await vi.waitFor(() => expect(track(w).getBoundingClientRect().width).toBeGreaterThan(10))

    w.selected!.value = false
    await tick()
    await vi.waitFor(() => expect(track(w).getBoundingClientRect().width).toBe(0))
  })

  it('带 icon 时图标位宽度不变，图标与勾选交接', async () => {
    const w = await mountChip(
      { selectable: true, icon: <svg data-probe="" /> },
      '科幻',
      signal(false),
    )
    const before = track(w).getBoundingClientRect().width
    expect(before).toBeGreaterThan(10)

    w.selected!.value = true
    await tick()
    await vi.waitFor(() => expect(w.element.querySelectorAll('svg')).toHaveLength(2))
    expect(track(w).getBoundingClientRect().width).toBe(before)
    const icon = w.element.querySelector('[data-probe]')!.parentElement as HTMLElement
    await vi.waitFor(() => expect(parseFloat(getComputedStyle(icon).opacity)).toBe(0))
  })

  it('disabled 不进 tab 序列，点击不切换', async () => {
    const disabled = await mountChip({ selectable: true, disabled: true })
    const reachable = await mountChip({ selectable: true })
    await userEvent.tab()
    expect(document.activeElement).toBe(reachable.element)

    await userEvent.click(disabled.element, { force: true })
    expect(disabled.onSelectedChange).not.toHaveBeenCalled()
  })
})

describe('chip · 可移除', () => {
  it('根不可聚焦，Tab 落在移除按钮，Enter 与 Backspace 都触发 remove', async () => {
    const w = await mountChip({ removable: true })
    await userEvent.tab()
    const remove = w.element.querySelector('button') as HTMLElement
    expect(document.activeElement).toBe(remove)

    await userEvent.keyboard('{Enter}')
    expect(w.onRemove).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('{Backspace}')
    expect(w.onRemove).toHaveBeenCalledTimes(2)
  })

  it('点击移除按钮不冒泡为条目点击', async () => {
    const onClick = vi.fn()
    const w = await mountChip({ removable: true, onClick })
    await userEvent.click(w.element.querySelector('button') as HTMLElement)
    expect(w.onRemove).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })
})
