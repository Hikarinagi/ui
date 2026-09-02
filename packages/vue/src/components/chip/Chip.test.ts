import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Chip from './Chip.vue'
import { resetDevWarnings } from '../../lib/dev'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
  resetDevWarnings()
})

const label = { default: () => '科幻' }

describe('结构与语义', () => {
  it('默认渲染 span，没有按钮也没有切换语义', () => {
    const w = mount(Chip, { slots: label })
    expect(w.element.tagName).toBe('SPAN')
    expect(w.find('button').exists()).toBe(false)
    expect(w.attributes('aria-pressed')).toBeUndefined()
    expect(w.text()).toBe('科幻')
  })

  it('selectable 渲染 button，aria-pressed 跟随 selected，点击回写', async () => {
    const onUpdate = vi.fn()
    const w = mount(Chip, {
      props: { selectable: true, selected: false, 'onUpdate:selected': onUpdate },
      slots: label,
    })
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.attributes('type')).toBe('button')
    expect(w.attributes('aria-pressed')).toBe('false')
    expect(w.attributes('data-state')).toBeUndefined()
    expect(w.find('svg').exists()).toBe(false)

    await w.trigger('click')
    expect(onUpdate).toHaveBeenCalledWith(true)

    await w.setProps({ selected: true })
    expect(w.attributes('aria-pressed')).toBe('true')
    expect(w.attributes('data-state')).toBe('selected')
    expect(w.find('svg').exists()).toBe(true)
  })

  it('removable 的根仍是 span，移除按钮点击与退格、删除键都触发 remove', async () => {
    const w = mount(Chip, { props: { removable: true }, slots: label })
    expect(w.element.tagName).toBe('SPAN')
    const remove = w.find('button')
    expect(remove.attributes('type')).toBe('button')
    expect(remove.attributes('aria-label')).toBe('移除')

    await remove.trigger('click')
    await remove.trigger('keydown', { key: 'Backspace' })
    await remove.trigger('keydown', { key: 'Delete' })
    await remove.trigger('keydown', { key: 'a' })
    expect(w.emitted('remove')).toHaveLength(3)
    expect(w.emitted('update:selected')).toBeUndefined()
  })

  it('disabled 的可选中条目不切换，可移除条目的按钮禁用', async () => {
    const onUpdate = vi.fn()
    const w = mount(Chip, {
      props: { selectable: true, disabled: true, 'onUpdate:selected': onUpdate },
      slots: label,
    })
    expect(w.attributes('disabled')).toBeDefined()
    await w.trigger('click')
    expect(onUpdate).not.toHaveBeenCalled()

    const removable = mount(Chip, { props: { removable: true, disabled: true }, slots: label })
    expect(removable.attributes('data-disabled')).toBeDefined()
    expect(removable.find('button').attributes('disabled')).toBeDefined()
  })

  it('selectable 与 removable 同时设置时告警并忽略 removable', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const w = mount(Chip, { props: { selectable: true, removable: true }, slots: label })
    expect(warn).toHaveBeenCalledTimes(1)
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.findAll('button')).toHaveLength(1)
    warn.mockRestore()
  })

  it('icon 插槽渲染在文字前', () => {
    const w = mount(Chip, {
      slots: { ...label, icon: () => h('i', { 'data-probe': '' }) },
    })
    expect(w.find('[data-probe]').exists()).toBe(true)
    expect(w.element.firstElementChild?.querySelector('[data-probe]')).not.toBeNull()
  })

  it('无障碍零违例', async () => {
    const selectable = mount(Chip, {
      props: { selectable: true, selected: true },
      slots: label,
      attachTo: document.body,
    })
    await expectNoA11yViolations(selectable.element)

    const removable = mount(Chip, {
      props: { removable: true },
      slots: label,
      attachTo: document.body,
    })
    await expectNoA11yViolations(removable.element)
  })
})
