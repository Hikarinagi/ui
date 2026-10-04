import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { RadioGroup, type RadioGroupProps } from './RadioGroup'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 480px; padding: 40px'
  document.body.appendChild(host)
  return host
}

const options = [
  { value: 'wish', label: '想看' },
  { value: 'doing', label: '在看' },
  { value: 'done', label: '看过' },
]

async function mountGroup(props: Partial<RadioGroupProps> = {}) {
  const model = signal<string | number | null | undefined>(props.value)
  function Harness() {
    const value = model.use()
    return (
      <RadioGroup
        options={options}
        {...props}
        value={value}
        onValueChange={next => (model.value = next)}
        aria-label="状态"
      />
    )
  }
  const host = attach()
  await render(<Harness />, { container: host })
  const element = host.firstElementChild as HTMLElement
  return {
    w: { element, props: () => ({ value: model.value }) },
    radios: () => Array.from(element.querySelectorAll('[role="radio"]')) as HTMLElement[],
  }
}

describe('radio-group · 键盘', () => {
  it('整组一个 Tab 停靠点，落在已选项上；方向键移动并选中；再 Tab 离开整组', async () => {
    const { w, radios } = await mountGroup({ value: 'doing' })
    const before = document.createElement('button')
    document.body.prepend(before)
    const after = document.createElement('button')
    document.body.append(after)
    before.focus()
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(radios()[1]))
    await userEvent.keyboard('{ArrowDown>}')
    await new Promise(r => setTimeout(r, 60))
    await userEvent.keyboard('{/ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement).toBe(radios()[2]))
    await vi.waitFor(() => expect(w.props().value).toBe('done'))
    for (let i = 0; i < 2; i++) {
      await userEvent.keyboard('{ArrowUp>}')
      await new Promise(r => setTimeout(r, 60))
      await userEvent.keyboard('{/ArrowUp}')
    }
    await vi.waitFor(() => expect(document.activeElement).toBe(radios()[0]))
    await vi.waitFor(() => expect(w.props().value).toBe('wish'))
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(after))
  })

  it('点文字即选中，圆点出现；三档圆为 14 / 16 / 18 的正圆', async () => {
    const { w, radios } = await mountGroup()
    const labels = Array.from(w.element.querySelectorAll('[data-hn-radio] > span')) as HTMLElement[]
    await userEvent.click(labels[2]!)
    await vi.waitFor(() => expect(w.props().value).toBe('done'))
    await vi.waitFor(() => expect(radios()[2]!.querySelector('span')).toBeTruthy())
    for (const [size, px] of [
      ['sm', 14],
      ['md', 16],
      ['lg', 18],
    ] as const) {
      const { radios: sized } = await mountGroup({ size })
      const box = sized()[0]!
      expect(box.offsetWidth).toBe(px)
      expect(box.offsetHeight).toBe(px)
      expect(parseFloat(getComputedStyle(box).borderRadius)).toBeGreaterThanOrEqual(px)
    }
  })
})
