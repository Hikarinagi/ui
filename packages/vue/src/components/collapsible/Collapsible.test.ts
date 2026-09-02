import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import Collapsible from './Collapsible.vue'
import CollapsibleTrigger from './CollapsibleTrigger.vue'
import CollapsibleContent from './CollapsibleContent.vue'
import Button from '../button/Button.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

function harness(props: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      setup() {
        return () =>
          h(Collapsible, props, () => [
            h(CollapsibleTrigger, () => '展开'),
            h(CollapsibleContent, () => h('p', '折叠内容')),
          ])
      },
    }),
    { attachTo: document.body },
  )
}

describe('行为', () => {
  it('默认收起,点击 trigger 展开,aria-expanded 联动', async () => {
    const w = harness()
    const trigger = w.find('button')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(w.find('[data-state="open"][role="region"]').exists()).toBe(false)

    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(w.text()).toContain('折叠内容')
  })

  it('defaultOpen 生效;disabled 时点击无效', async () => {
    const opened = harness({ defaultOpen: true })
    expect(opened.find('button').attributes('aria-expanded')).toBe('true')

    const locked = harness({ disabled: true })
    await locked.find('button').trigger('click')
    expect(locked.find('button').attributes('aria-expanded')).toBe('false')
  })

  it('受控 v-model:open', async () => {
    const open = ref(false)
    const w = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Collapsible,
              { open: open.value, 'onUpdate:open': (v: boolean) => (open.value = v) },
              () => [
                h(CollapsibleTrigger, () => '开关'),
                h(CollapsibleContent, () => h('p', '内容')),
              ],
            )
        },
      }),
      { attachTo: document.body },
    )
    await w.find('button').trigger('click')
    expect(open.value).toBe(true)
    open.value = false
    await w.vm.$nextTick()
    expect(w.find('button').attributes('aria-expanded')).toBe('false')
  })

  it('默认自己渲染 Button 并自带展开指示物,调用方不用组合', () => {
    const w = harness()
    const btn = w.find('button')
    expect(btn.classes()).toContain('hn-interactive')
    expect(btn.classes()).toContain('group/hn-disclosure')

    const mark = btn.find('span[aria-hidden="true"]')
    expect(mark.classes()).toContain('hn-transition')
    expect(mark.classes()).toContain('group-data-open/hn-disclosure:rotate-180')
    expect(mark.find('svg').exists()).toBe(true)
  })

  it('icon 为 false 时不出指示物', () => {
    const w = mount(
      defineComponent({
        setup() {
          return () =>
            h(Collapsible, null, () => [
              h(CollapsibleTrigger, { icon: false }, () => '展开'),
              h(CollapsibleContent, () => h('p', '内容')),
            ])
        },
      }),
      { attachTo: document.body },
    )
    expect(w.find('button span[aria-hidden="true"]').exists()).toBe(false)
  })

  it('icon 插槽只换字形,旋转仍由指示物负责', () => {
    const w = mount(
      defineComponent({
        setup() {
          return () =>
            h(Collapsible, null, () => [
              h(CollapsibleTrigger, null, {
                default: () => '展开',
                icon: () => h('i', { class: 'custom-glyph' }),
              }),
              h(CollapsibleContent, () => h('p', '内容')),
            ])
        },
      }),
      { attachTo: document.body },
    )
    const mark = w.find('button span[aria-hidden="true"]')
    expect(mark.find('.custom-glyph').exists()).toBe(true)
    expect(mark.find('svg').exists()).toBe(false)
    expect(mark.classes()).toContain('group-data-open/hn-disclosure:rotate-180')
  })

  it('trigger 支持 asChild 借体给项目 Button', async () => {
    const w = mount(
      defineComponent({
        setup() {
          return () =>
            h(Collapsible, () => [
              h(CollapsibleTrigger, { asChild: true }, () =>
                h(Button, { variant: 'ghost', tone: 'neutral' }, () => '借体开关'),
              ),
              h(CollapsibleContent, () => h('p', '内容')),
            ])
        },
      }),
      { attachTo: document.body },
    )
    const btn = w.find('button')
    expect(btn.classes()).toContain('hn-interactive')
    await btn.trigger('click')
    expect(btn.attributes('aria-expanded')).toBe('true')
  })

  it('content 挂上折叠动效并接通 reka 高度变量(defaultOpen 挂载时 reka 特意省略 data-state 以跳过入场动画)', async () => {
    const w = harness()
    await w.find('button').trigger('click')
    const content = w.find('.hn-anim-collapse')
    expect(content.exists()).toBe(true)
    expect(content.attributes('data-state')).toBe('open')
    expect(content.classes().join(' ')).toContain(
      '[--hn-collapse-h:var(--reka-collapsible-content-height)]',
    )
  })
})

describe('a11y', () => {
  it('无 a11y 违规(开合两态)', async () => {
    const closed = harness()
    await expectNoA11yViolations(closed.element as HTMLElement)
    const opened = harness({ defaultOpen: true })
    await expectNoA11yViolations(opened.element as HTMLElement)
  })
})
