import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Table from './Table.vue'
import TableHeader from './TableHeader.vue'
import TableBody from './TableBody.vue'
import TableRow from './TableRow.vue'
import TableHead from './TableHead.vue'
import TableCell from './TableCell.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

function harness(caption = 'Button 的属性') {
  return mount(
    defineComponent({
      setup: () => () =>
        h(Table, { caption }, () => [
          h(TableHeader, () => [
            h(TableRow, () => [
              h(TableHead, () => '属性'),
              h(TableHead, () => '类型'),
              h(TableHead, { align: 'end' }, () => '默认值'),
            ]),
          ]),
          h(TableBody, () => [
            h(TableRow, () => [
              h(TableCell, () => 'variant'),
              h(TableCell, () => 'solid | soft | outline | ghost | link'),
              h(TableCell, { align: 'end' }, () => 'solid'),
            ]),
            h(TableRow, () => [
              h(TableCell, () => 'size'),
              h(TableCell, () => 'sm | md | lg'),
              h(TableCell, { align: 'end' }, () => 'md'),
            ]),
          ]),
        ]),
    }),
    { attachTo: document.body },
  )
}

describe('结构与语义', () => {
  it('语义六件族齐整;caption 是表格的可达名;th 默认 scope=col', () => {
    const w = harness()
    expect(w.find('table.hn-table').exists()).toBe(true)
    expect(w.find('caption').text()).toBe('Button 的属性')
    expect(w.find('thead').exists()).toBe(true)
    expect(w.find('tbody').exists()).toBe(true)
    expect(w.findAll('th').length).toBe(3)
    expect(w.find('th').attributes('scope')).toBe('col')
    expect(w.findAll('td').length).toBe(6)
  })

  it('align 只在 center/end 落类,start 零类', () => {
    const w = harness()
    const heads = w.findAll('th')
    expect(heads[0]!.classes()).not.toContain('text-end')
    expect(heads[2]!.classes()).toContain('text-end')
  })

  it('无障碍零违例', async () => {
    const w = harness()
    await expectNoA11yViolations(w.element)
  })
})
