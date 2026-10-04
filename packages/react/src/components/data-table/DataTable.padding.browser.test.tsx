import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { DataTable } from './DataTable'
import { Table } from '../table/Table'
import { TableHeader } from '../table/TableHeader'
import { TableBody } from '../table/TableBody'
import { TableRow } from '../table/TableRow'
import { TableHead } from '../table/TableHead'
import { TableCell } from '../table/TableCell'
import '../../../test/browser.css'

const mounted: Array<{ unmount: () => unknown }> = []
afterEach(async () => {
  for (const screen of mounted.splice(0)) await screen.unmount()
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
    async density => {
      const container = host(density)
      mounted.push(
        await render(
          <DataTable<{ id: number; value: string }>
            rows={[{ id: 1, value: 'Value' }]}
            rowKey="id"
            columns={[
              {
                key: 'value',
                label: 'Value',
                cellClass: 'py-3 px-5',
                headerClass: 'pt-2 pb-4 px-5',
              },
            ]}
          />,
          { container },
        ),
      )
      expect(padding(container.querySelector('tbody td')!)).toEqual([
        '12px',
        '12px',
        '20px',
        '20px',
      ])
      expect(padding(container.querySelector('thead th')!)).toEqual(['8px', '16px', '20px', '20px'])
    },
  )

  it.each(['comfortable', 'compact'])(
    'keeps default Table spacing and allows per-cell overrides in %s density',
    async density => {
      const container = host(density)
      mounted.push(
        await render(
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Default</TableHead>
                <TableHead className="py-3">Custom</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Default</TableCell>
                <TableCell className="py-3">Custom</TableCell>
              </TableRow>
            </TableBody>
          </Table>,
          { container },
        ),
      )
      for (const selector of ['th', 'td']) {
        const cells = container.querySelectorAll(selector)
        expect(padding(cells[0]!).slice(0, 2)).toEqual(['0px', '0px'])
        expect(padding(cells[1]!).slice(0, 2)).toEqual(['12px', '12px'])
      }
    },
  )
})
