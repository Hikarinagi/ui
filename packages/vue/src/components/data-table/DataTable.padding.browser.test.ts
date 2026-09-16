import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import DataTable from './DataTable.vue'
import Table from '../table/Table.vue'
import TableHead from '../table/TableHead.vue'
import TableCell from '../table/TableCell.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

function host(density: string) {
  const element = document.createElement('div')
  element.style.width = '600px'
  element.dataset.density = density
  document.body.append(element)
  return element
}

function padding(element: Element) {
  const style = getComputedStyle(element)
  return [
    style.paddingBlockStart,
    style.paddingBlockEnd,
    style.paddingInlineStart,
    style.paddingInlineEnd,
  ]
}

describe('Table cell padding overrides', () => {
  it.each(['comfortable', 'compact'])(
    'honors DataTable cellClass and headerClass in %s density',
    density => {
      const wrapper = mount(DataTable<{ id: number; value: string }>, {
        props: {
          rows: [{ id: 1, value: 'Value' }],
          rowKey: 'id',
          columns: [
            { key: 'value', label: 'Value', cellClass: 'py-3 px-5', headerClass: 'pt-2 pb-4 px-5' },
          ],
        },
        attachTo: host(density),
      })
      mounted.push(wrapper)
      expect(padding(wrapper.find('tbody td').element)).toEqual(['12px', '12px', '20px', '20px'])
      expect(padding(wrapper.find('thead th').element)).toEqual(['8px', '16px', '20px', '20px'])
    },
  )

  it.each(['comfortable', 'compact'])(
    'keeps default Table spacing and allows per-cell overrides in %s density',
    density => {
      const wrapper = mount(Table, {
        slots: {
          default: () => [
            h('thead', [
              h('tr', [
                h(TableHead, () => 'Default'),
                h(TableHead, { class: 'py-3' }, () => 'Custom'),
              ]),
            ]),
            h('tbody', [
              h('tr', [
                h(TableCell, () => 'Default'),
                h(TableCell, { class: 'py-3' }, () => 'Custom'),
              ]),
            ]),
          ],
        },
        attachTo: host(density),
      })
      mounted.push(wrapper)
      for (const selector of ['th', 'td']) {
        const cells = wrapper.findAll(selector)
        expect(padding(cells[0]!.element).slice(0, 2)).toEqual(['0px', '0px'])
        expect(padding(cells[1]!.element).slice(0, 2)).toEqual(['12px', '12px'])
      }
    },
  )
})
