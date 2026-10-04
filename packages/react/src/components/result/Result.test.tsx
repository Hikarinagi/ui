import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { Result } from './Result'
import { Button } from '../button/Button'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

describe('Result', () => {
  it('status 决定图标与配色，标题、说明与操作沿用 Empty 的排布', async () => {
    const { container, unmount } = render(
      <Result
        status="success"
        title="书评已发布"
        description="其他读者现在可以看到它了。"
        actions={<Button size="sm">查看书评</Button>}
      />,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('data-hn-result')).toBe('')
    expect(wrapper.getAttribute('data-status')).toBe('success')
    const icon = wrapper.querySelector('[aria-hidden="true"] span')!
    expect([...icon.classList]).toContain('bg-success-soft')
    expect([...icon.classList]).toContain('size-14')
    expect(icon.querySelector('svg')).not.toBeNull()
    expect(wrapper.querySelector('p')!.textContent).toBe('书评已发布')
    expect(wrapper.querySelector('button')!.textContent).toBe('查看书评')
    await expectNoA11yViolations(wrapper)
    unmount()
  })

  it('四种状态各自映射到语义色；默认是 info', () => {
    const classes = (status?: 'success' | 'error' | 'warning' | 'info') => {
      const { container, unmount } = render(<Result title="结果" {...(status ? { status } : {})} />)
      const list = [...container.querySelector('[aria-hidden="true"] span')!.classList]
      unmount()
      return list
    }
    expect(classes()).toContain('bg-info-soft')
    expect(classes('error')).toContain('bg-danger-soft')
    expect(classes('warning')).toContain('bg-warning-soft')
  })

  it('icon 插槽替换状态图标，默认插槽放在文字下方', () => {
    const wrapper = render(
      <Result status="error" title="提交失败" size="lg" icon={<img src="x.png" alt="" />}>
        <p className="detail">错误代码 500</p>
      </Result>,
    ).container.firstElementChild as HTMLElement
    expect(wrapper.querySelector('img')).not.toBeNull()
    expect(wrapper.querySelector('.bg-danger-soft')).toBeNull()
    expect(wrapper.querySelector('.detail')!.textContent).toBe('错误代码 500')
  })
})
