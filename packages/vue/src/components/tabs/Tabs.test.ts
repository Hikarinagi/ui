import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Tabs from './Tabs.vue'
import TabsList from './TabsList.vue'
import TabsTrigger from './TabsTrigger.vue'
import TabsContent from './TabsContent.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

function harness(props: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      setup() {
        return () =>
          h(Tabs, { defaultValue: 'a', ...props }, () => [
            h(TabsList, { label: '分组' }, () => [
              h(TabsTrigger, { value: 'a' }, () => '甲'),
              h(TabsTrigger, { value: 'b' }, () => '乙'),
            ]),
            h(TabsContent, { value: 'a' }, () => '甲的内容'),
            h(TabsContent, { value: 'b' }, () => '乙的内容'),
          ])
      },
    }),
    { attachTo: document.body },
  )
}

const triggerClasses = (w: ReturnType<typeof harness>) => w.find('[role="tab"]').classes().join(' ')

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
    for (const tab of w.findAll('[role="tab"]')) {
      expect(tab.classes()).toContain('h-10')
    }
  })
})

describe('服务端渲染', () => {
  const html = (props: Record<string, unknown> = {}) =>
    renderToString(
      createSSRApp(
        defineComponent({
          render: () =>
            h(Tabs, { defaultValue: 'a', ...props }, () => [
              h(TabsList, { label: '分组' }, () => [
                h(TabsTrigger, { value: 'a' }, () => '甲'),
                h(TabsTrigger, { value: 'b' }, () => '乙'),
              ]),
              h(TabsContent, { value: 'a' }, () => '甲的内容'),
            ]),
        }),
      ),
    )

  it('首屏的选中页签自带指示条，不等水合；未选中页签没有', async () => {
    const out = await html()
    const active = out.indexOf('data-state="active"')
    const inactive = out.indexOf('data-state="inactive"')
    const bar = out.indexOf('bg-accent')
    expect(out.match(/bg-accent/g)).toHaveLength(1)
    expect(bar).toBeGreaterThan(active)
    expect(bar).toBeLessThan(inactive)
    expect(out).toContain('bottom-px')
  })

  it('soft 形态的静态滑块铺满页签盒', async () => {
    const out = await html({ variant: 'soft' })
    expect(out.match(/bg-surface/g)).toHaveLength(1)
    expect(out).toContain('inset-0')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    await expectNoA11yViolations(harness({ size: 'lg' }).element as HTMLElement)
  })
})
