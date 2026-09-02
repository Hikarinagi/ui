import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Listbox from './Listbox.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说', description: '文库本' },
  { value: 'manga', label: '漫画', disabled: true },
  { label: '周边', options: [{ value: 'cd', label: '音乐 CD' }] },
]

describe('结构', () => {
  it('根是列表面板，内部是 role=listbox，选项是 role=option，分组是带标签的 role=group，attrs 透传到 listbox', () => {
    const w = mount(Listbox, { props: { options }, attrs: { 'aria-label': '类型' } })
    expect(w.attributes('data-hn-listbox')).toBe('')
    expect(w.classes()).toContain('bg-surface')
    const list = w.find('[role="listbox"]')
    expect(list.attributes('aria-label')).toBe('类型')
    expect(list.attributes('aria-multiselectable')).toBe('false')
    expect(w.findAll('[role="option"]').map(o => o.text())).toEqual([
      'Galgame',
      '轻小说文库本',
      '漫画',
      '音乐 CD',
    ])
    expect(w.findAll('[role="option"]')[2]!.attributes('data-disabled')).toBe('')
    const group = w.find('[role="group"]')
    expect(group.exists()).toBe(true)
    expect(group.text()).toContain('周边')
  })

  it('已选项带 aria-selected 与勾；multiple 时 aria-multiselectable 为真', () => {
    const single = mount(Listbox, { props: { options, modelValue: 'ln' } })
    const chosen = single.findAll('[role="option"]')[1]!
    expect(chosen.attributes('aria-selected')).toBe('true')
    expect(chosen.find('svg').exists()).toBe(true)
    const multi = mount(Listbox, { props: { options, multiple: true, modelValue: ['gal', 'cd'] } })
    expect(multi.find('[role="listbox"]').attributes('aria-multiselectable')).toBe('true')
    expect(multi.findAll('[aria-selected="true"]')).toHaveLength(2)
  })

  it('secondary 是扁平形态；disabled 落根；空列表显示提示；maxHeight 落到滚动区', () => {
    expect(mount(Listbox, { props: { options, variant: 'secondary' } }).classes()).toContain(
      'bg-inset',
    )
    expect(mount(Listbox, { props: { options, disabled: true } }).attributes('data-disabled')).toBe(
      '',
    )
    expect(mount(Listbox, { props: { options: [] } }).text()).toBe('无匹配项')
    const tall = mount(Listbox, { props: { options, maxHeight: '8rem' } })
    expect(tall.find('[data-overlayscrollbars-initialize]').attributes('style')).toContain(
      'max-height: 8rem',
    )
  })

  it('无 a11y 违规', async () => {
    const w = mount(Listbox, {
      props: { options, modelValue: 'gal' },
      attrs: { 'aria-label': '类型' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
