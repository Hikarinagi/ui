import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { useState, type ReactNode } from 'react'
import { SegmentedControl } from './SegmentedControl'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const options = [
  { value: 'all', label: '全部' },
  { value: 'ongoing', label: '连载中' },
  { value: 'done', label: '已完结', disabled: true },
]

function mount(ui: ReactNode) {
  const container = render(ui).container
  return {
    element: container.firstElementChild as HTMLElement,
    find: (selector: string) => container.querySelector(selector) as HTMLElement,
    items: () => [...container.querySelectorAll('button')],
  }
}

describe('结构', () => {
  it('根是 role=group 承接 attrs；每项是带 aria-pressed 的按钮；未绑定值时选中第一个可用项', async () => {
    const w = mount(<SegmentedControl options={options} className="w-64" aria-label="连载状态" />)
    const root = w.find('[data-hn-segmented-control]')
    expect(root.getAttribute('role')).toBe('group')
    expect(root.getAttribute('aria-label')).toBe('连载状态')
    expect([...root.classList]).toContain('w-64')
    expect(w.items().map(item => item.textContent?.trim())).toEqual(['全部', '连载中', '已完结'])
    expect(w.items().map(item => item.getAttribute('aria-pressed'))).toEqual([
      'true',
      'false',
      'false',
    ])
    expect(w.items()[2]!.getAttribute('disabled')).not.toBeNull()
  })

  it('disabled 落到根与每一项；三档、block 与 vertical 落在类上', () => {
    const disabled = mount(<SegmentedControl options={options} disabled />)
    expect(disabled.find('[data-hn-segmented-control]').getAttribute('data-disabled')).toBe('')
    expect(disabled.items().every(item => item.getAttribute('disabled') !== null)).toBe(true)

    const sm = mount(<SegmentedControl options={options} size="sm" />)
    expect([...sm.items()[0]!.classList]).toContain('text-sm')
    const lg = mount(<SegmentedControl options={options} size="lg" />)
    expect([...lg.items()[0]!.classList]).toContain('text-md')

    const block = mount(<SegmentedControl options={options} block />)
    expect([...block.find('[data-hn-segmented-control]').classList]).toContain('w-full')
    expect([...block.items()[0]!.classList]).toContain('flex-1')

    const vertical = mount(<SegmentedControl options={options} orientation="vertical" />)
    expect([...vertical.find('[data-hn-segmented-control]').classList]).toContain('flex-col')
  })

  it('使用 #option 插槽时，项的名称仍取 label', () => {
    const w = mount(
      <SegmentedControl options={options} value="all" renderOption={() => <i>图标</i>} />,
    )
    expect(w.items().map(item => item.getAttribute('aria-label'))).toEqual([
      '全部',
      '连载中',
      '已完结',
    ])
  })
})

describe('服务端渲染', () => {
  it('首屏的选中项自带滑块的填充，不等水合', async () => {
    const html = renderToString(
      <SegmentedControl options={options} value="ongoing" aria-label="连载状态" />,
    )
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1)
    expect(html.match(/bg-surface/g)).toHaveLength(1)
    expect(html.indexOf('bg-surface')).toBeGreaterThan(html.indexOf('aria-pressed="true"'))
  })
})

describe('交互', () => {
  it('点击某项写回值；再点已选项不会取消选择', async () => {
    const update = vi.fn()
    function Harness() {
      const [value, setValue] = useState<string | number | undefined>('all')
      return (
        <SegmentedControl
          options={options}
          value={value}
          onValueChange={next => {
            update(next)
            setValue(next)
          }}
        />
      )
    }
    const w = mount(<Harness />)
    fireEvent.click(w.items()[1]!)
    expect(update.mock.calls[0]).toEqual(['ongoing'])
    expect(w.items()[1]!.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(w.items()[1]!)
    expect(update.mock.calls).toHaveLength(1)
    expect(w.items()[1]!.getAttribute('aria-pressed')).toBe('true')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(<SegmentedControl options={options} value="all" aria-label="连载状态" />)
    await expectNoA11yViolations(w.element)
  })
})
