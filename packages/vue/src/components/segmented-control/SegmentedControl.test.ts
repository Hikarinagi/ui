import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import SegmentedControl from './SegmentedControl.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const options = [
  { value: 'all', label: '全部' },
  { value: 'ongoing', label: '连载中' },
  { value: 'done', label: '已完结', disabled: true },
]

const items = (w: ReturnType<typeof mount>) => w.findAll('button')

describe('结构', () => {
  it('根是 role=group 承接 attrs；每项是带 aria-pressed 的按钮；未绑定值时选中第一个可用项', async () => {
    const w = mount(SegmentedControl, {
      props: { options, class: 'w-64' },
      attrs: { 'aria-label': '连载状态' },
    })
    await nextTick()
    const root = w.find('[data-hn-segmented-control]')
    expect(root.attributes('role')).toBe('group')
    expect(root.attributes('aria-label')).toBe('连载状态')
    expect(root.classes()).toContain('w-64')
    expect(items(w).map(item => item.text())).toEqual(['全部', '连载中', '已完结'])
    expect(items(w).map(item => item.attributes('aria-pressed'))).toEqual([
      'true',
      'false',
      'false',
    ])
    expect(items(w)[2]!.attributes('disabled')).toBeDefined()
  })

  it('disabled 落到根与每一项；三档、block 与 vertical 落在类上', () => {
    const disabled = mount(SegmentedControl, { props: { options, disabled: true } })
    expect(disabled.find('[data-hn-segmented-control]').attributes('data-disabled')).toBe('')
    expect(items(disabled).every(item => item.attributes('disabled') !== undefined)).toBe(true)

    const sm = mount(SegmentedControl, { props: { options, size: 'sm' } })
    expect(items(sm)[0]!.classes()).toContain('text-sm')
    const lg = mount(SegmentedControl, { props: { options, size: 'lg' } })
    expect(items(lg)[0]!.classes()).toContain('text-md')

    const block = mount(SegmentedControl, { props: { options, block: true } })
    expect(block.find('[data-hn-segmented-control]').classes()).toContain('w-full')
    expect(items(block)[0]!.classes()).toContain('flex-1')

    const vertical = mount(SegmentedControl, { props: { options, orientation: 'vertical' } })
    expect(vertical.find('[data-hn-segmented-control]').classes()).toContain('flex-col')
  })

  it('使用 #option 插槽时，项的名称仍取 label', () => {
    const w = mount(SegmentedControl, {
      props: { options, modelValue: 'all' },
      slots: { option: '<i>图标</i>' },
    })
    expect(items(w).map(item => item.attributes('aria-label'))).toEqual([
      '全部',
      '连载中',
      '已完结',
    ])
  })
})

describe('服务端渲染', () => {
  it('首屏的选中项自带滑块的填充，不等水合', async () => {
    const html = await renderToString(
      createSSRApp(
        defineComponent({
          render: () =>
            h(SegmentedControl, { options, modelValue: 'ongoing', 'aria-label': '连载状态' }),
        }),
      ),
    )
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1)
    expect(html.match(/bg-surface/g)).toHaveLength(1)
    expect(html.indexOf('bg-surface')).toBeGreaterThan(html.indexOf('aria-pressed="true"'))
  })
})

describe('交互', () => {
  it('点击某项写回值；再点已选项不会取消选择', async () => {
    const w = mount(SegmentedControl, {
      props: {
        options,
        modelValue: 'all',
        'onUpdate:modelValue': (value?: string | number) => w.setProps({ modelValue: value }),
      },
      attachTo: document.body,
    })
    await items(w)[1]!.trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['ongoing'])
    expect(items(w)[1]!.attributes('aria-pressed')).toBe('true')
    await items(w)[1]!.trigger('click')
    expect(w.emitted('update:modelValue')).toHaveLength(1)
    expect(items(w)[1]!.attributes('aria-pressed')).toBe('true')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(SegmentedControl, {
      props: { options, modelValue: 'all' },
      attrs: { 'aria-label': '连载状态' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
