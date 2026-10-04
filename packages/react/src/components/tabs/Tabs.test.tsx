import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import { createRef } from 'react'
import type { ScrollAreaHandle } from '../scroll-area/ScrollArea'
import { renderToString } from 'react-dom/server'
import { Tabs, type TabsProps } from './Tabs'
import { TabsList } from './TabsList'
import { TabsTrigger } from './TabsTrigger'
import { TabsContent } from './TabsContent'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function harness(props: Partial<TabsProps> = {}) {
  const { container } = render(
    <Tabs defaultValue="a" {...props}>
      <TabsList label="分组">
        <TabsTrigger value="a">甲</TabsTrigger>
        <TabsTrigger value="b">乙</TabsTrigger>
      </TabsList>
      <TabsContent value="a">甲的内容</TabsContent>
      <TabsContent value="b">乙的内容</TabsContent>
    </Tabs>,
  )
  return container
}

const triggerClasses = (w: HTMLElement) => w.querySelector('[role="tab"]')!.className

describe('尺寸档', () => {
  it('三档各自的高度与内边距,underline 形态', () => {
    expect(triggerClasses(harness({ size: 'sm' }))).toContain('h-8')
    expect(triggerClasses(harness({ size: 'md' }))).toContain('h-9')
    expect(triggerClasses(harness({ size: 'lg' }))).toContain('h-10')
    expect(triggerClasses(harness({ size: 'lg' }))).toContain('px-3.5')
  })

  it('三档各自的高度,soft 形态比 underline 各低一档', () => {
    expect(triggerClasses(harness({ size: 'sm', variant: 'soft' }))).toContain('h-7')
    expect(triggerClasses(harness({ size: 'md', variant: 'soft' }))).toContain('h-8')
    expect(triggerClasses(harness({ size: 'lg', variant: 'soft' }))).toContain('h-9')
  })

  it('默认为 md', () => {
    expect(triggerClasses(harness())).toContain('h-9')
  })

  it('字号在所有档位恒为 sm —— 页签是界面 chrome,尺寸只改这一行的疏密', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const cls = triggerClasses(harness({ size }))
      expect(cls).toContain('text-sm')
      expect(cls).not.toContain('text-base')
      expect(cls).not.toContain('text-md')
    }
  })

  it('尺寸经 provide/inject 从根流到每个页签,调用方不逐个传', () => {
    const w = harness({ size: 'lg' })
    for (const tab of w.querySelectorAll('[role="tab"]')) {
      expect([...tab.classList]).toContain('h-10')
    }
  })
})

describe('服务端渲染', () => {
  const html = (props: Partial<TabsProps> = {}) =>
    renderToString(
      <Tabs defaultValue="a" {...props}>
        <TabsList label="分组">
          <TabsTrigger value="a">甲</TabsTrigger>
          <TabsTrigger value="b">乙</TabsTrigger>
        </TabsList>
        <TabsContent value="a">甲的内容</TabsContent>
      </Tabs>,
    )

  it('首屏的选中页签自带指示条，不等水合；未选中页签没有', async () => {
    const out = html()
    const active = out.indexOf('data-state="active"')
    const inactive = out.indexOf('data-state="inactive"')
    const bar = out.indexOf('bg-accent')
    expect(out.match(/bg-accent/g)).toHaveLength(1)
    expect(bar).toBeGreaterThan(active)
    expect(bar).toBeLessThan(inactive)
    expect(out).toContain('bottom-px')
  })

  it('soft 形态的静态滑块铺满页签盒', async () => {
    const out = html({ variant: 'soft' })
    expect(out.match(/bg-surface/g)).toHaveLength(1)
    expect(out).toContain('inset-0')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    await expectNoA11yViolations(harness({ size: 'lg' }).firstElementChild!)
  })
})

describe('实例方法', () => {
  it('TabsList 暴露内部滚动区域的 viewport 与 instance', async () => {
    const handle = createRef<ScrollAreaHandle>()
    render(
      <Tabs defaultValue="a">
        <TabsList ref={handle}>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    await act(async () => {
      for (let index = 0; index < 4; index += 1)
        await new Promise(resolve => requestAnimationFrame(resolve))
    })
    expect(handle.current?.viewport).toBeInstanceOf(HTMLElement)
    expect(handle.current?.instance).toBeTruthy()
  })
})
