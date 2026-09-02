import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Accordion from './Accordion.vue'
import AccordionItem from './AccordionItem.vue'
import AccordionTrigger from './AccordionTrigger.vue'
import AccordionContent from './AccordionContent.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

function harness(
  rootProps: Record<string, unknown> = {},
  items: Array<{ value: string; disabled?: boolean; trigger?: Record<string, unknown> }> = [
    { value: 'a' },
    { value: 'b' },
  ],
) {
  return mount(
    defineComponent({
      setup() {
        return () =>
          h(Accordion, rootProps, () =>
            items.map(item =>
              h(AccordionItem, { value: item.value, disabled: item.disabled }, () => [
                h(AccordionTrigger, item.trigger ?? null, () => `标题 ${item.value}`),
                h(AccordionContent, null, () => h('p', `内容 ${item.value}`)),
              ]),
            ),
          )
      },
    }),
    { attachTo: document.body },
  )
}

function triggers(w: ReturnType<typeof harness>) {
  return w.findAll('button')
}

describe('结构与语义', () => {
  it('触发器是 h3 里的按钮，带展开指示物，内容区默认收起', () => {
    const w = harness()
    const heading = w.find('h3')
    expect(heading.exists()).toBe(true)
    const btn = heading.find('button')
    expect(btn.attributes('aria-expanded')).toBe('false')
    expect(btn.find('svg').exists()).toBe(true)
    expect(btn.classes()).toContain('hn-state-layer')
    expect(btn.classes()).toContain('hn-press-none')
    expect(w.text()).not.toContain('内容 a')
  })

  it('level 换标题层级，icon 为 false 时不出指示物', () => {
    const w = harness({}, [{ value: 'a', trigger: { level: 2, icon: false } }])
    expect(w.find('h2').exists()).toBe(true)
    expect(w.find('h3').exists()).toBe(false)
    expect(w.find('button svg').exists()).toBe(false)
  })

  it('single 模式一次只展开一项，再点同一项默认不收起', async () => {
    const w = harness()
    const [a, b] = triggers(w)
    await a!.trigger('click')
    expect(a!.attributes('aria-expanded')).toBe('true')
    expect(w.text()).toContain('内容 a')

    await b!.trigger('click')
    expect(b!.attributes('aria-expanded')).toBe('true')
    expect(a!.attributes('aria-expanded')).toBe('false')

    await b!.trigger('click')
    expect(b!.attributes('aria-expanded')).toBe('true')
  })

  it('collapsible 允许收起当前项；multiple 允许多项同时展开', async () => {
    const single = harness({ collapsible: true })
    await triggers(single)[0]!.trigger('click')
    await triggers(single)[0]!.trigger('click')
    expect(triggers(single)[0]!.attributes('aria-expanded')).toBe('false')

    const multiple = harness({ type: 'multiple' })
    await triggers(multiple)[0]!.trigger('click')
    await triggers(multiple)[1]!.trigger('click')
    expect(triggers(multiple)[0]!.attributes('aria-expanded')).toBe('true')
    expect(triggers(multiple)[1]!.attributes('aria-expanded')).toBe('true')
  })

  it('defaultValue 指定初始展开项，v-model 回写', async () => {
    const w = harness({ defaultValue: 'b' })
    expect(triggers(w)[1]!.attributes('aria-expanded')).toBe('true')

    const values: unknown[] = []
    const controlled = harness({
      modelValue: 'a',
      'onUpdate:modelValue': (v: unknown) => values.push(v),
    })
    await triggers(controlled)[1]!.trigger('click')
    expect(values).toEqual(['b'])
  })

  it('禁用项的触发器不可用', () => {
    const w = harness({}, [{ value: 'a', disabled: true }, { value: 'b' }])
    expect(triggers(w)[0]!.attributes('disabled')).toBeDefined()
    expect(triggers(w)[1]!.attributes('disabled')).toBeUndefined()
  })

  it('无障碍零违例', async () => {
    const w = harness({ defaultValue: 'a' })
    await expectNoA11yViolations(w.element)
  })
})
