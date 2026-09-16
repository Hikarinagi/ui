import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Rating from './Rating.vue'
import { starFill } from './utils/fill'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const radiosOf = (w: ReturnType<typeof mount>) => w.findAll('[role="radio"]')

function mountRating(
  modelValue: number,
  extra: Record<string, unknown> = {},
  attachTo: HTMLElement = document.body,
) {
  const w = mount(Rating, {
    props: {
      modelValue,
      ...extra,
      'onUpdate:modelValue': (value: number) => w.setProps({ modelValue: value }),
    },
    attrs: { 'aria-label': '评分' },
    attachTo,
  })
  return w
}

describe('结构', () => {
  it('五颗星各是一个带本地化名称的单选项，选中值之内的星带 data-state=active；attrs 落在组上', () => {
    const w = mountRating(3, { class: 'gap-2' })
    expect(w.find('[data-hn-rating]').classes()).toContain('gap-2')
    expect(w.find('[role="radiogroup"]').attributes('aria-label')).toBe('评分')
    const radios = radiosOf(w)
    expect(radios).toHaveLength(5)
    expect(radios.map(r => r.attributes('aria-label'))).toEqual([
      '1 星',
      '2 星',
      '3 星',
      '4 星',
      '5 星',
    ])
    expect(radios.map(r => r.attributes('data-state'))).toEqual([
      'active',
      'active',
      'active',
      undefined,
      undefined,
    ])
  })

  it('step 为 0.5 时每颗星有两个单选项，半星的名称是小数', () => {
    const w = mountRating(2.5, { step: 0.5 })
    const radios = radiosOf(w)
    expect(radios).toHaveLength(10)
    expect(radios[0]!.attributes('aria-label')).toBe('0.5 星')
    expect(radios.filter(r => r.attributes('data-state') === 'active')).toHaveLength(5)
  })

  it('max 改变星的数量', () => {
    expect(radiosOf(mountRating(0, { max: 10 }))).toHaveLength(10)
  })
})

describe('值', () => {
  it('点一颗星即交出数字；再点同一颗清零；clearable 关闭后不清零', async () => {
    const w = mountRating(0)
    await radiosOf(w)[3]!.trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([4])
    await radiosOf(w)[3]!.trigger('click')
    expect(w.emitted('update:modelValue')?.[1]).toEqual([0])
    const fixed = mountRating(4, { clearable: false })
    await radiosOf(fixed)[3]!.trigger('click')
    expect(fixed.emitted('update:modelValue')).toBeUndefined()
  })

  it('disabled 落在根上，点击不交出值', async () => {
    const w = mountRating(2, { disabled: true })
    expect(w.find('[data-hn-rating]').attributes('data-disabled')).toBe('')
    await radiosOf(w)[4]!.trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('只读', () => {
  it('readonly 渲染为一张带名称的图，没有单选项，星按小数填充', () => {
    const w = mountRating(4.3, { readonly: true })
    const root = w.find('[data-hn-rating]')
    expect(root.attributes('role')).toBe('img')
    expect(root.attributes('aria-label')).toBe('4.3 星，满分 5 星')
    expect(radiosOf(w)).toHaveLength(0)
    const fills = w.findAll('[data-hn-rating] > span > span')
    expect(fills.map(f => f.attributes('style'))).toEqual([
      'width: 100%;',
      'width: 100%;',
      'width: 100%;',
      'width: 100%;',
      'width: 30%;',
    ])
  })

  it('填充比例按星序裁切', () => {
    expect(starFill(4.3, 1)).toBe('100%')
    expect(starFill(4.3, 5)).toBe('30%')
    expect(starFill(4.3, 6)).toBe('0%')
    expect(starFill(0, 1)).toBe('0%')
  })
})

describe('分制与星数', () => {
  it('10 分制显示五颗星，半星单选项使用实际分值和选中态', () => {
    const w = mountRating(7, { max: 10, stars: 5, step: 0.5 })
    const radios = radiosOf(w)
    expect(w.findAll('label')).toHaveLength(5)
    expect(radios).toHaveLength(10)
    expect(radios.map(r => r.attributes('aria-label'))).toEqual(
      Array.from({ length: 10 }, (_, i) => `${i + 1} 分，满分 10 分`),
    )
    expect(radios.filter(r => r.attributes('data-state') === 'active')).toHaveLength(7)
    expect(radios[6]!.attributes('aria-checked')).toBe('true')
  })

  it('整星返回两分，半星返回一分，再次点击清零', async () => {
    const whole = mountRating(0, { max: 10, stars: 5 })
    await radiosOf(whole)[3]!.trigger('click')
    expect(whole.emitted('update:modelValue')?.[0]).toEqual([8])
    const half = mountRating(0, { max: 10, stars: 5, step: 0.5 })
    await radiosOf(half)[6]!.trigger('click')
    expect(half.emitted('update:modelValue')?.[0]).toEqual([7])
    await radiosOf(half)[6]!.trigger('click')
    expect(half.emitted('update:modelValue')?.[1]).toEqual([0])
  })

  it('禁用和不可清除的行为保持不变', async () => {
    const disabled = mountRating(8, { max: 10, stars: 5, disabled: true })
    await radiosOf(disabled)[4]!.trigger('click')
    expect(disabled.emitted('update:modelValue')).toBeUndefined()
    const fixed = mountRating(8, { max: 10, stars: 5, clearable: false })
    await radiosOf(fixed)[3]!.trigger('click')
    expect(fixed.emitted('update:modelValue')).toBeUndefined()
  })

  it('只读小数按分制填充，名称使用分数而不是星数', () => {
    const w = mountRating(8.6, { max: 10, stars: 5, readonly: true })
    expect(w.attributes('aria-label')).toBe('8.6 分，满分 10 分')
    expect(w.findAll('[data-hn-rating] > span > span').map(f => f.attributes('style'))).toEqual([
      'width: 100%;',
      'width: 100%;',
      'width: 100%;',
      'width: 100%;',
      'width: 30%;',
    ])
  })

  it('动态改变分制和星数会重算显示，但不改绑定值', async () => {
    const w = mountRating(8, { max: 10, stars: 5 })
    await w.setProps({ max: 20 })
    expect(radiosOf(w).filter(r => r.attributes('data-state') === 'active')).toHaveLength(2)
    await w.setProps({ stars: 10 })
    expect(radiosOf(w)).toHaveLength(10)
    expect(radiosOf(w).filter(r => r.attributes('data-state') === 'active')).toHaveLength(4)
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it.each([1, 7, 10, 100])('满分 %s 不能整除星数时仍能回显并清零', async max => {
    const w = mountRating(0, { max, stars: 3 })
    await radiosOf(w)[0]!.trigger('click')
    expect(w.props('modelValue')).toBeCloseTo(max / 3, 12)
    expect(radiosOf(w)[0]!.attributes('aria-checked')).toBe('true')
    await radiosOf(w)[0]!.trigger('click')
    expect(w.props('modelValue')).toBe(0)
  })

  it('原生表单提交实际分值且不重复，清零和禁用同步到表单', async () => {
    const form = document.createElement('form')
    document.body.appendChild(form)
    const w = mountRating(7, { max: 10, stars: 5, step: 0.5, name: 'score' }, form)
    expect(new FormData(form).getAll('score')).toEqual(['7'])
    await radiosOf(w)[8]!.trigger('click')
    expect(new FormData(form).getAll('score')).toEqual(['9'])
    await radiosOf(w)[8]!.trigger('click')
    expect(new FormData(form).getAll('score')).toEqual(['0'])
    await w.setProps({ disabled: true })
    expect(new FormData(form).has('score')).toBe(false)
  })
})

describe('服务端渲染', () => {
  it('首屏渲染出五颗星与选中态', async () => {
    const html = await renderToString(
      createSSRApp(
        defineComponent({ render: () => h(Rating, { modelValue: 3, 'aria-label': '评分' }) }),
      ),
    )
    expect(html.match(/role="radio"/g)).toHaveLength(5)
    expect(html.match(/data-state="active"/g)).toHaveLength(3)
  })

  it('首屏按分制映射交互选中态和只读填充', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () => h(Rating, { modelValue: 7, max: 10, stars: 5, step: 0.5 }),
      }),
    )
    expect(html.match(/role="radio"/g)).toHaveLength(10)
    expect(html.match(/data-state="active"/g)).toHaveLength(7)
    expect(html).toContain('aria-label="7 分，满分 10 分"')
    const readonly = await renderToString(
      createSSRApp({
        render: () => h(Rating, { modelValue: 7, max: 10, stars: 5, readonly: true }),
      }),
    )
    expect(readonly.match(/width:100%/g)).toHaveLength(3)
    expect(readonly).toContain('width:50%')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountRating(3)
    await expectNoA11yViolations(w.element)
    const still = mountRating(4.3, { readonly: true })
    await expectNoA11yViolations(still.element)
    const scaled = mountRating(7, { max: 10, stars: 5, step: 0.5 })
    await expectNoA11yViolations(scaled.element)
  })
})
