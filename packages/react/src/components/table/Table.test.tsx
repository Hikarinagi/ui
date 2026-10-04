import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import { createRef } from 'react'
import type { ScrollAreaHandle } from '../scroll-area/ScrollArea'
import { Table } from './Table'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { TableRow } from './TableRow'
import { TableHead } from './TableHead'
import { TableCell } from './TableCell'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

function harness(caption = 'Button 的属性') {
  return render(
    <Table caption={caption}>
      <TableHeader>
        <TableRow>
          <TableHead>属性</TableHead>
          <TableHead>类型</TableHead>
          <TableHead align="end">默认值</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>variant</TableCell>
          <TableCell>solid | soft | outline | ghost | link</TableCell>
          <TableCell align="end">solid</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>size</TableCell>
          <TableCell>sm | md | lg</TableCell>
          <TableCell align="end">md</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  ).container.firstElementChild as HTMLElement
}

describe('结构与语义', () => {
  it('语义六件族齐整;caption 是表格的可达名;th 默认 scope=col', () => {
    const w = harness()
    expect(w.querySelector('table.hn-table')).not.toBeNull()
    expect(w.querySelector('caption')!.textContent).toBe('Button 的属性')
    expect(w.querySelector('thead')).not.toBeNull()
    expect(w.querySelector('tbody')).not.toBeNull()
    expect(w.querySelectorAll('th').length).toBe(3)
    expect(w.querySelector('th')!.getAttribute('scope')).toBe('col')
    expect(w.querySelectorAll('td').length).toBe(6)
  })

  it('align 只在 center/end 落类,start 零类', () => {
    const w = harness()
    const heads = w.querySelectorAll('th')
    expect([...heads[0]!.classList]).not.toContain('text-end')
    expect([...heads[2]!.classList]).toContain('text-end')
  })

  it('无障碍零违例', async () => {
    const w = harness()
    await expectNoA11yViolations(w)
  })
})

describe('实例方法', () => {
  it('暴露内部滚动区域的 viewport 与 instance', async () => {
    const handle = createRef<ScrollAreaHandle>()
    render(<Table ref={handle} />)
    await act(async () => {
      for (let index = 0; index < 4; index += 1)
        await new Promise(resolve => requestAnimationFrame(resolve))
    })
    expect(handle.current?.viewport).toBeInstanceOf(HTMLElement)
    expect(handle.current?.instance).toBeTruthy()
  })
})
