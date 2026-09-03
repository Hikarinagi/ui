import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { renderToString } from 'vue/server-renderer'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import TagsInput from './TagsInput.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const chips = (w: ReturnType<typeof mount>) => w.findAll('[data-hn-chip]')
const field = (w: ReturnType<typeof mount>) => w.find('input[type="text"]')

describe('结构', () => {
  it('根是输入面宿主，class 落根、attrs 落文本输入；每个值一枚可移除的 Chip', () => {
    const w = mount(TagsInput, {
      props: { modelValue: ['galgame', '轻小说'], placeholder: '添加标签', class: 'mt-2' },
      attrs: { 'aria-label': '标签' },
    })
    const root = w.find('[data-hn-tags-input]')
    expect(root.classes()).toContain('hn-field')
    expect(w.find('[data-hn-tags-input] > div').classes()).toContain('flex-wrap')
    expect(root.classes()).toContain('mt-2')
    expect(field(w).attributes('aria-label')).toBe('标签')
    expect(field(w).attributes('placeholder')).toBe('添加标签')
    expect(chips(w).map(chip => chip.text())).toEqual(['galgame', '轻小说'])
    expect(chips(w).every(chip => chip.find('button').exists())).toBe(true)
  })

  it('尺寸落到宿主、输入区与 Chip；disabled 与 invalid 各落其位；name 渲染隐藏输入', () => {
    const w = mount(TagsInput, {
      props: { modelValue: ['a'], size: 'sm', disabled: true, invalid: true, name: 'tags' },
    })
    const root = w.find('[data-hn-tags-input]')
    expect(root.classes()).toContain('py-[calc((0.25rem-2px)/2)]')
    expect(root.classes()).toContain('h-auto')
    expect(root.classes()).toContain('min-h-[var(--hn-input-h)]')
    expect(root.classes()).toContain('[--hn-input-h:var(--hn-control-h-sm)]')
    expect(root.attributes('data-invalid')).toBe('')
    expect(field(w).attributes('disabled')).toBeDefined()
    expect(field(w).attributes('aria-invalid')).toBe('true')
    expect(chips(w)[0]!.classes()).toContain('h-[calc(var(--hn-control-h-sm)-0.25rem)]')
    const form = mount(
      defineComponent({
        render: () => h('form', [h(TagsInput, { modelValue: ['a'], name: 'tags' })]),
      }),
    )
    expect(form.find('input[name="tags[0]"]').exists()).toBe(true)
  })
})

describe('交互', () => {
  it('Enter 把输入内容加成标签并清空输入；点 Chip 的移除钮删掉它', async () => {
    const w = mount(TagsInput, {
      props: {
        modelValue: ['a'],
        'onUpdate:modelValue': (value: string[]) => w.setProps({ modelValue: value }),
      },
      attachTo: document.body,
    })
    const input = field(w).element as HTMLInputElement
    input.value = 'b'
    await field(w).trigger('keydown', { key: 'Enter' })
    await nextTick()
    await nextTick()
    expect(w.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])
    expect(input.value).toBe('')

    await chips(w)[0]!.find('button').trigger('click')
    expect(w.emitted('update:modelValue')?.[1]).toEqual([['b']])
  })

  it('达到 max 或者重复时不加入并发 invalid', async () => {
    const w = mount(TagsInput, {
      props: {
        modelValue: ['a'],
        max: 1,
        'onUpdate:modelValue': (value: string[]) => w.setProps({ modelValue: value }),
      },
      attachTo: document.body,
    })
    const input = field(w).element as HTMLInputElement
    input.value = 'b'
    await field(w).trigger('keydown', { key: 'Enter' })
    await nextTick()
    await nextTick()
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(w.emitted('invalid')?.[0]).toEqual(['b'])

    await w.setProps({ max: 0 })
    input.value = 'a'
    await field(w).trigger('keydown', { key: 'Enter' })
    await nextTick()
    await nextTick()
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(w.emitted('invalid')?.[1]).toEqual(['a'])
  })

  it('clearable 时有值才显示清除钮，点它清空并发 clear', async () => {
    const w = mount(TagsInput, {
      props: {
        modelValue: ['a', 'b'],
        clearable: true,
        'onUpdate:modelValue': (value: string[]) => w.setProps({ modelValue: value }),
      },
    })
    expect(w.find('[data-hn-tags-input-clear]').exists()).toBe(true)
    await w.find('[data-hn-tags-input-clear] button').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect(w.emitted('clear')).toHaveLength(1)
    expect(w.find('[data-hn-tags-input-clear]').exists()).toBe(false)
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(TagsInput, {
      props: { modelValue: ['galgame', '轻小说'] },
      attrs: { 'aria-label': '标签' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})

describe('服务端渲染', () => {
  it('首屏没有任何标签处于选中态', async () => {
    const html = await renderToString(
      createSSRApp(
        defineComponent({
          render: () => h(TagsInput, { modelValue: ['galgame', 'manga'], 'aria-label': '标签' }),
        }),
      ),
    )
    expect(html.match(/data-hn-chip/g)).toHaveLength(2)
    expect(html).not.toContain('data-state="active"')
    expect(html).not.toContain('aria-current')
  })
})
