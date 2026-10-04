import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Listbox } from './Listbox'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说', description: '文库本' },
  { value: 'manga', label: '漫画', disabled: true },
  { label: '周边', options: [{ value: 'cd', label: '音乐 CD' }] },
]

function mount(ui: ReactNode) {
  return render(ui).container.firstElementChild as HTMLElement
}

describe('结构', () => {
  it('根是列表面板，内部是 role=listbox，选项是 role=option，分组是带标签的 role=group，attrs 透传到 listbox', () => {
    const w = mount(<Listbox options={options} aria-label="类型" />)
    expect(w.getAttribute('data-hn-listbox')).toBe('')
    expect([...w.classList]).toContain('bg-surface')
    const list = w.querySelector('[role="listbox"]')!
    expect(list.getAttribute('aria-label')).toBe('类型')
    expect(list.getAttribute('aria-multiselectable')).toBe('false')
    expect([...w.querySelectorAll('[role="option"]')].map(o => o.textContent)).toEqual([
      'Galgame',
      '轻小说文库本',
      '漫画',
      '音乐 CD',
    ])
    expect(w.querySelectorAll('[role="option"]')[2]!.getAttribute('data-disabled')).toBe('')
    const group = w.querySelector('[role="group"]')
    expect(group).not.toBeNull()
    expect(group!.textContent).toContain('周边')
  })

  it('已选项带 aria-selected 与勾；multiple 时 aria-multiselectable 为真', () => {
    const single = mount(<Listbox options={options} value="ln" />)
    const chosen = single.querySelectorAll('[role="option"]')[1]!
    expect(chosen.getAttribute('aria-selected')).toBe('true')
    expect(chosen.querySelector('svg')).not.toBeNull()
    const multi = mount(<Listbox options={options} multiple value={['gal', 'cd']} />)
    expect(multi.querySelector('[role="listbox"]')!.getAttribute('aria-multiselectable')).toBe(
      'true',
    )
    expect(multi.querySelectorAll('[aria-selected="true"]')).toHaveLength(2)
  })

  it('secondary 是扁平形态；disabled 落根；空列表显示提示；maxHeight 落到滚动区', () => {
    expect([...mount(<Listbox options={options} variant="secondary" />).classList]).toContain(
      'bg-inset',
    )
    expect(mount(<Listbox options={options} disabled />).getAttribute('data-disabled')).toBe('')
    expect(mount(<Listbox options={[]} />).textContent).toBe('无匹配项')
    const tall = mount(<Listbox options={options} maxHeight="8rem" />)
    expect(
      tall.querySelector('[data-overlayscrollbars-initialize]')!.getAttribute('style'),
    ).toContain('max-height: 8rem')
  })

  it('无 a11y 违规', async () => {
    const w = mount(<Listbox options={options} value="gal" aria-label="类型" />)
    await expectNoA11yViolations(w)
  })
})
