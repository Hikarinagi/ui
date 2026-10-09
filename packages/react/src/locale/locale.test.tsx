import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { CloseButton } from '../components/close-button/CloseButton'
import { UiLocaleProvider, enUS, jaJP, zhCN } from './index'

afterEach(cleanup)

function shape(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return typeof value
  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entry]) => [key, shape(entry)]),
  )
}

describe('语言包', () => {
  it('三个语言包的键与取值类型完全一致', () => {
    expect(shape(enUS)).toEqual(shape(zhCN))
    expect(shape(jaJP)).toEqual(shape(zhCN))
  })

  it('jaJP 用 ja-JP 作为 Intl 语言标签,函数文案返回日文字符串', () => {
    expect(jaJP.tag).toBe('ja-JP')
    expect(jaJP.pagination.rangeLabel(1, 10, 42)).toBe('1–10 / 全 42 件')
    expect(jaJP.pagination.rangeLabel(0, 0, 0)).toBe('全 0 件')
    expect(jaJP.carousel.position(2, 5)).toBe('5 件中 2 件目')
    expect(jaJP.rating.label(4, 5)).toBe('星 5 個中 4 個')
    expect(jaJP.upload.removeFile('a.png')).toBe('a.png を削除')
  })

  it('UiLocaleProvider 传入 jaJP 后组件使用日文文案', () => {
    const { container } = render(
      <UiLocaleProvider messages={jaJP}>
        <CloseButton />
      </UiLocaleProvider>,
    )
    expect(container.querySelector('button')!.getAttribute('aria-label')).toBe('閉じる')
  })
})
