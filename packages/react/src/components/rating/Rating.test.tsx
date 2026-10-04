import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { useState } from 'react'
import { Rating, type RatingProps } from './Rating'
import { starFill } from '../../../../shared/src/lib/rating'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mountRating(
  modelValue: number,
  extra: Partial<RatingProps> = {},
  attachTo: HTMLElement = document.body,
) {
  const emitted: number[] = []
  const state = { modelValue }
  function Harness(props: Partial<RatingProps>) {
    const [value, setValue] = useState(modelValue)
    state.modelValue = value
    return (
      <Rating
        value={value}
        {...props}
        onValueChange={next => {
          emitted.push(next)
          setValue(next)
        }}
        aria-label="评分"
      />
    )
  }
  let current = extra
  const container = attachTo.appendChild(document.createElement('div'))
  const screen = render(<Harness {...extra} />, { container })
  const root = () => container.firstElementChild as HTMLElement
  return {
    emitted,
    props: () => state.modelValue,
    setProps: (next: Partial<RatingProps>) => {
      current = { ...current, ...next }
      screen.rerender(<Harness {...current} />)
    },
    root,
    attributes: (name: string) => root().getAttribute(name) ?? undefined,
    find: (selector: string) => container.querySelector<HTMLElement>(selector),
    findAll: (selector: string) => Array.from(container.querySelectorAll<HTMLElement>(selector)),
  }
}

type Wrapper = ReturnType<typeof mountRating>

const radiosOf = (w: Wrapper) => w.findAll('[role="radio"]')
const attr = (el: Element, name: string) => el.getAttribute(name) ?? undefined

describe('结构', () => {
  it('五颗星各是一个带本地化名称的单选项，选中值之内的星带 data-state=active；attrs 落在组上', () => {
    const w = mountRating(3, { className: 'gap-2' })
    expect(w.find('[data-hn-rating]')!.classList).toContain('gap-2')
    expect(w.find('[role="radiogroup"]')!.getAttribute('aria-label')).toBe('评分')
    const radios = radiosOf(w)
    expect(radios).toHaveLength(5)
    expect(radios.map(r => attr(r, 'aria-label'))).toEqual(['1 星', '2 星', '3 星', '4 星', '5 星'])
    expect(radios.map(r => attr(r, 'data-state'))).toEqual([
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
    expect(attr(radios[0]!, 'aria-label')).toBe('0.5 星')
    expect(radios.filter(r => attr(r, 'data-state') === 'active')).toHaveLength(5)
  })

  it('max 改变星的数量', () => {
    expect(radiosOf(mountRating(0, { max: 10 }))).toHaveLength(10)
  })
})

describe('值', () => {
  it('点一颗星即交出数字；再点同一颗清零；clearable 关闭后不清零', async () => {
    const w = mountRating(0)
    fireEvent.click(radiosOf(w)[3]!)
    expect(w.emitted[0]).toEqual(4)
    fireEvent.click(radiosOf(w)[3]!)
    expect(w.emitted[1]).toEqual(0)
    const fixed = mountRating(4, { clearable: false })
    fireEvent.click(radiosOf(fixed)[3]!)
    expect(fixed.emitted[0]).toBeUndefined()
  })

  it('disabled 落在根上，点击不交出值', async () => {
    const w = mountRating(2, { disabled: true })
    expect(w.find('[data-hn-rating]')!.getAttribute('data-disabled')).toBe('')
    fireEvent.click(radiosOf(w)[4]!)
    expect(w.emitted[0]).toBeUndefined()
  })
})

describe('只读', () => {
  it('readonly 渲染为一张带名称的图，没有单选项，星按小数填充', () => {
    const w = mountRating(4.3, { readonly: true })
    const root = w.find('[data-hn-rating]')!
    expect(root.getAttribute('role')).toBe('img')
    expect(root.getAttribute('aria-label')).toBe('4.3 星，满分 5 星')
    expect(radiosOf(w)).toHaveLength(0)
    const fills = w.findAll('[data-hn-rating] > span > span')
    expect(fills.map(f => attr(f, 'style'))).toEqual([
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
    expect(radios.map(r => attr(r, 'aria-label'))).toEqual(
      Array.from({ length: 10 }, (_, i) => `${i + 1} 分，满分 10 分`),
    )
    expect(radios.filter(r => attr(r, 'data-state') === 'active')).toHaveLength(7)
    expect(attr(radios[6]!, 'aria-checked')).toBe('true')
  })

  it('整星返回两分，半星返回一分，再次点击清零', async () => {
    const whole = mountRating(0, { max: 10, stars: 5 })
    fireEvent.click(radiosOf(whole)[3]!)
    expect(whole.emitted[0]).toEqual(8)
    const half = mountRating(0, { max: 10, stars: 5, step: 0.5 })
    fireEvent.click(radiosOf(half)[6]!)
    expect(half.emitted[0]).toEqual(7)
    fireEvent.click(radiosOf(half)[6]!)
    expect(half.emitted[1]).toEqual(0)
  })

  it('禁用和不可清除的行为保持不变', async () => {
    const disabled = mountRating(8, { max: 10, stars: 5, disabled: true })
    fireEvent.click(radiosOf(disabled)[4]!)
    expect(disabled.emitted[0]).toBeUndefined()
    const fixed = mountRating(8, { max: 10, stars: 5, clearable: false })
    fireEvent.click(radiosOf(fixed)[3]!)
    expect(fixed.emitted[0]).toBeUndefined()
  })

  it('只读小数按分制填充，名称使用分数而不是星数', () => {
    const w = mountRating(8.6, { max: 10, stars: 5, readonly: true })
    expect(w.attributes('aria-label')).toBe('8.6 分，满分 10 分')
    expect(w.findAll('[data-hn-rating] > span > span').map(f => attr(f, 'style'))).toEqual([
      'width: 100%;',
      'width: 100%;',
      'width: 100%;',
      'width: 100%;',
      'width: 30%;',
    ])
  })

  it('动态改变分制和星数会重算显示，但不改绑定值', async () => {
    const w = mountRating(8, { max: 10, stars: 5 })
    w.setProps({ max: 20 })
    expect(radiosOf(w).filter(r => attr(r, 'data-state') === 'active')).toHaveLength(2)
    w.setProps({ stars: 10 })
    expect(radiosOf(w)).toHaveLength(10)
    expect(radiosOf(w).filter(r => attr(r, 'data-state') === 'active')).toHaveLength(4)
    expect(w.emitted[0]).toBeUndefined()
  })

  it.each([1, 7, 10, 100])('满分 %s 不能整除星数时仍能回显并清零', async max => {
    const w = mountRating(0, { max, stars: 3 })
    fireEvent.click(radiosOf(w)[0]!)
    expect(w.props()).toBeCloseTo(max / 3, 12)
    expect(attr(radiosOf(w)[0]!, 'aria-checked')).toBe('true')
    fireEvent.click(radiosOf(w)[0]!)
    expect(w.props()).toBe(0)
  })

  it('原生表单提交实际分值且不重复，清零和禁用同步到表单', async () => {
    const form = document.createElement('form')
    document.body.appendChild(form)
    const w = mountRating(7, { max: 10, stars: 5, step: 0.5, name: 'score' }, form)
    expect(new FormData(form).getAll('score')).toEqual(['7'])
    fireEvent.click(radiosOf(w)[8]!)
    expect(new FormData(form).getAll('score')).toEqual(['9'])
    fireEvent.click(radiosOf(w)[8]!)
    expect(new FormData(form).getAll('score')).toEqual(['0'])
    w.setProps({ disabled: true })
    expect(new FormData(form).has('score')).toBe(false)
  })
})

describe('服务端渲染', () => {
  it('首屏渲染出五颗星与选中态', async () => {
    const html = renderToString(<Rating value={3} aria-label="评分" />)
    expect(html.match(/role="radio"/g)).toHaveLength(5)
    expect(html.match(/data-state="active"/g)).toHaveLength(3)
  })

  it('首屏按分制映射交互选中态和只读填充', async () => {
    const html = renderToString(<Rating value={7} max={10} stars={5} step={0.5} />)
    expect(html.match(/role="radio"/g)).toHaveLength(10)
    expect(html.match(/data-state="active"/g)).toHaveLength(7)
    expect(html).toContain('aria-label="7 分，满分 10 分"')
    const readonly = renderToString(<Rating value={7} max={10} stars={5} readonly />)
    expect(readonly.match(/width:100%/g)).toHaveLength(3)
    expect(readonly).toContain('width:50%')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountRating(3)
    await expectNoA11yViolations(w.root())
    const still = mountRating(4.3, { readonly: true })
    await expectNoA11yViolations(still.root())
    const scaled = mountRating(7, { max: 10, stars: 5, step: 0.5 })
    await expectNoA11yViolations(scaled.root())
  })
})
