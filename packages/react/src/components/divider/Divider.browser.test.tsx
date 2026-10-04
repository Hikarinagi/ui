import { beforeEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Divider, type DividerProps } from './Divider'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

async function mountRow(dividerProps: Partial<DividerProps>) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  await render(
    <div style={{ display: 'flex', alignItems: 'center', height: '36px', width: '200px' }}>
      <span>左</span>
      <Divider orientation="vertical" {...dividerProps} />
      <span>右</span>
    </div>,
    { container: host },
  )
  return document.querySelector('[role="separator"], [data-orientation]') as HTMLElement
}

describe('divider · 竖分隔线两用法', () => {
  it('默认拉满容器高', async () => {
    const line = await mountRow({})
    expect(line.offsetHeight).toBe(36)
    expect(line.offsetTop).toBe(0)
  })

  it('定高短线配 self-center 垂直居中,不顶对齐', async () => {
    const line = await mountRow({ className: 'h-6 self-center' })
    expect(line.offsetHeight).toBe(24)
    expect(line.offsetTop).toBe(6)
  })
})
