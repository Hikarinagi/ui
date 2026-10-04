import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { MeterGroup } from './MeterGroup'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

describe('MeterGroup', () => {
  it('按比例分段，图例列出标签与百分比，未指定色调时按序分配', async () => {
    const { container, unmount } = render(
      <MeterGroup
        label="存储空间"
        items={[
          { label: '文档', value: 40 },
          { label: '图片', value: 25, tone: 'warning' },
        ]}
      />,
    )
    const wrapper = container.firstElementChild as HTMLElement
    const segments = wrapper.querySelectorAll('[role="meter"]')
    expect(segments).toHaveLength(2)
    expect(segments[0]!.getAttribute('style')).toContain('width: 40%')
    expect(segments[0]!.getAttribute('aria-valuenow')).toBe('40')
    expect(segments[0]!.getAttribute('aria-valuemax')).toBe('100')
    expect(segments[0]!.getAttribute('aria-label')).toBe('文档')
    expect([...segments[0]!.classList]).toContain('bg-accent')
    expect([...segments[1]!.classList]).toContain('bg-warning')
    expect(wrapper.querySelector('[role="group"]')!.getAttribute('aria-label')).toBe('存储空间')
    expect(wrapper.textContent).toContain('40%')
    expect(wrapper.textContent).toContain('25%')
    expect(wrapper.textContent).toContain('65%')
    await expectNoA11yViolations(wrapper)
    unmount()
  })

  it('越界的值按端点处理，format 同时用于图例与 aria-valuetext', () => {
    const wrapper = render(
      <MeterGroup
        max={128}
        items={[{ label: '视频', value: 200 }]}
        format={(value, max) => `${value} / ${max} GB`}
      />,
    ).container.firstElementChild as HTMLElement
    const segment = wrapper.querySelector('[role="meter"]')!
    expect(segment.getAttribute('style')).toContain('width: 100%')
    expect(segment.getAttribute('aria-valuenow')).toBe('128')
    expect(segment.getAttribute('aria-valuetext')).toBe('128 / 128 GB')
    expect(wrapper.textContent).toContain('128 / 128 GB')
  })

  it('legend 为 false 时不渲染图例，没有 label 时不渲染标题行', () => {
    const wrapper = render(<MeterGroup legend={false} items={[{ label: '文档', value: 40 }]} />)
      .container.firstElementChild as HTMLElement
    expect(wrapper.textContent).toBe('')
    expect(wrapper.querySelectorAll('[role="meter"]')).toHaveLength(1)
  })
})
