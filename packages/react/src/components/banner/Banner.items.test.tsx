import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Banner, type BannerProps } from './Banner'
import type { BannerNotice } from './types'
import { expectNoA11yViolations } from '../../../test/axe'

type Notice = BannerNotice & { text: string }

const notices: Notice[] = [{ text: '一' }, { text: '二' }, { text: '三' }]

const text = ({ item }: { item: Notice }) => item.text

function Model(props: BannerProps<Notice>) {
  const [index, setIndex] = useState(props.index ?? 0)
  useEffect(() => {
    if (props.index !== undefined) setIndex(props.index)
  }, [props.index])
  return (
    <Banner<Notice>
      {...props}
      index={index}
      onIndexChange={value => {
        props.onIndexChange?.(value)
        setIndex(value)
      }}
    />
  )
}

function mount(ui: ReactNode) {
  const screen = render(ui)
  return { ...screen, element: screen.container }
}

function mountItems(props: Partial<BannerProps<Notice>> = {}) {
  const onIndexChange = vi.fn()
  const view = (extra: Partial<BannerProps<Notice>> = {}) => (
    <Model
      items={notices}
      renderItem={({ item }) => <b>{item.text}</b>}
      onIndexChange={onIndexChange}
      {...props}
      {...extra}
    />
  )
  const w = mount(view())
  return {
    ...w,
    onIndexChange,
    setProps: (extra: Partial<BannerProps<Notice>>) => w.rerender(view(extra)),
  }
}

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('Banner · 多条公告', () => {
  it('只渲染当前一条;上一条 / 下一条循环切换,计数随之变化并回写 index', async () => {
    const w = mountItems()
    expect(w.element.querySelector('b')!.textContent).toBe('一')
    expect(w.element.textContent).toContain('1 / 3')
    const [prev, next] = [...w.element.querySelectorAll('button')]
    expect(prev!.getAttribute('aria-label')).toBe('上一条')
    expect(next!.getAttribute('aria-label')).toBe('下一条')

    fireEvent.click(next!)
    expect(w.onIndexChange.mock.calls[0]).toEqual([1])
    w.setProps({ index: 1 })
    await vi.waitFor(() => expect(w.element.querySelector('b')!.textContent).toBe('二'))
    expect(w.element.textContent).toContain('2 / 3')

    fireEvent.click(prev!)
    fireEvent.click(prev!)
    expect(w.onIndexChange.mock.calls.at(-1)).toEqual([2])
  })

  it('每条可以自带 tone 与 icon:底色、字色与图标随当前一条变化,没有的沿用公告条的', async () => {
    const Star = () => <svg data-star="" />
    const items: Notice[] = [
      { text: '一' },
      { text: '二', tone: 'warning' },
      { text: '三', icon: Star },
    ]
    const view = (index?: number) => (
      <Banner<Notice> tone="info" items={items} index={index} renderItem={text} />
    )
    const w = mount(view())
    const bar = () => w.element.querySelector('[data-tone]')!
    expect(bar().getAttribute('data-tone')).toBe('info')
    expect(bar().classList).toContain('bg-info')
    expect(w.element.querySelector('[data-star]')).toBeNull()

    w.rerender(view(1))
    expect(bar().getAttribute('data-tone')).toBe('warning')
    expect(bar().classList).toContain('bg-warning')
    expect(bar().classList).toContain('text-warning-on')

    w.rerender(view(2))
    expect(bar().getAttribute('data-tone')).toBe('info')
    await vi.waitFor(() => expect(w.element.querySelector('[data-star]')).not.toBeNull())
  })

  it('只有一条时没有切换控件;手动切换时内容区是礼貌级实时区域,自动轮播时不是', () => {
    const single = mountItems({ items: [notices[0]!] })
    expect(single.element.querySelectorAll('button')).toHaveLength(0)
    expect(single.element.querySelector('[aria-live]')).toBeNull()

    expect(mountItems().element.querySelector('[aria-live]')!.getAttribute('aria-live')).toBe(
      'polite',
    )
    expect(mountItems({ autoplay: 3000 }).element.querySelector('[aria-live]')).toBeNull()
  })

  it('autoplay 按间隔切到下一条;悬停或聚焦时暂停,离开后继续', async () => {
    vi.useFakeTimers()
    const w = mountItems({ autoplay: 1000 })
    await act(() => vi.advanceTimersByTimeAsync(1000))
    expect(w.onIndexChange.mock.calls[0]).toEqual([1])
    w.setProps({ index: 1 })

    const bar = w.element.querySelector('[data-tone]')!
    fireEvent.pointerEnter(bar)
    await act(() => vi.advanceTimersByTimeAsync(2500))
    expect(w.onIndexChange).toHaveBeenCalledTimes(1)

    fireEvent.pointerLeave(bar)
    await act(() => vi.advanceTimersByTimeAsync(1000))
    expect(w.onIndexChange).toHaveBeenCalledTimes(2)
    w.setProps({ index: 2 })

    fireEvent.focusIn(bar)
    await act(() => vi.advanceTimersByTimeAsync(2500))
    expect(w.onIndexChange).toHaveBeenCalledTimes(2)
    fireEvent.focusOut(bar)
    await act(() => vi.advanceTimersByTimeAsync(1000))
    expect(w.onIndexChange.mock.calls.at(-1)).toEqual([0])
  })

  it('无障碍零违例', async () => {
    const w = mount(<Banner<Notice> items={notices} closable renderItem={text} />)
    await expectNoA11yViolations(w.element)
  })
})
