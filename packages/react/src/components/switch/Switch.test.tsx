import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { Switch } from './Switch'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const element = render(ui).container.firstElementChild as HTMLElement
  return {
    element,
    classes: () => [...element.classList],
    find: (selector: string) => element.querySelector(selector) as HTMLElement,
    findAll: (selector: string) => [...element.querySelectorAll<HTMLElement>(selector)],
  }
}

const emitted = (fn: Mock) => (fn.mock.calls.length ? fn.mock.calls : undefined)

describe('结构', () => {
  it('根是 label，轨道是 role=switch 的按钮，拇指在轨道内；attrs 落在轨道上，class 落在根上', () => {
    const w = mount(
      <Switch description="播放完自动跳到下一话" className="w-64" id="autoplay" data-x="1">
        自动播放
      </Switch>,
    )
    expect(w.element.tagName).toBe('LABEL')
    expect(w.element.getAttribute('data-hn-switch')).toBe('')
    expect(w.element.getAttribute('data-hn-state-group')).toBe('')
    expect(w.classes()).toContain('w-64')
    const track = w.find('[role="switch"]')
    expect(track.tagName).toBe('BUTTON')
    expect(track.getAttribute('type')).toBe('button')
    expect(track.getAttribute('id')).toBe('autoplay')
    expect(track.getAttribute('data-x')).toBe('1')
    expect(track.getAttribute('aria-checked')).toBe('false')
    expect(track.getAttribute('data-state')).toBe('unchecked')
    expect(track.getAttribute('data-hn-on')).toBeNull()
    expect(track.querySelector('[data-hn-thumb]')).not.toBeNull()
    expect(w.element.textContent).toContain('自动播放')
    expect(w.find('.text-muted').textContent).toBe('播放完自动跳到下一话')
  })

  it('选中时 aria-checked、data-state 与 data-hn-on 同步；无文字时只有轨道', () => {
    const on = mount(<Switch checked aria-label="自动播放" />)
    const track = on.find('[role="switch"]')
    expect(track.getAttribute('aria-checked')).toBe('true')
    expect(track.getAttribute('data-state')).toBe('checked')
    expect(track.getAttribute('data-hn-on')).toBe('')
    expect(track.getAttribute('aria-label')).toBe('自动播放')
    expect(on.findAll(':scope > span')).toHaveLength(0)
  })

  it('三档尺寸落在轨道的变量上，根的字号与描述随档位变化', () => {
    const sm = mount(<Switch size="sm" description="d" />)
    expect(sm.classes()).toContain('text-sm')
    expect([...sm.find('[role="switch"]').classList]).toContain('[--hn-switch-h:1.25rem]')
    expect([...sm.find('.text-muted').classList]).toContain('text-xs')
    const lg = mount(<Switch size="lg" description="d" />)
    expect(lg.classes()).toContain('text-md')
    expect([...lg.find('[role="switch"]').classList]).toContain('[--hn-switch-h:1.75rem]')
  })

  it('disabled 落在根与轨道上；invalid 只落在轨道上', () => {
    const disabled = mount(<Switch disabled />)
    expect(disabled.element.getAttribute('data-disabled')).toBe('')
    expect(disabled.find('[role="switch"]').getAttribute('disabled')).not.toBeNull()
    const invalid = mount(<Switch invalid />)
    expect(invalid.element.getAttribute('data-invalid')).toBeNull()
    const track = invalid.find('[role="switch"]')
    expect(track.getAttribute('data-invalid')).toBe('')
    expect(track.getAttribute('aria-invalid')).toBe('true')
  })
})

describe('交互', () => {
  it('点击轨道切换；禁用时不响应', () => {
    const onModel = vi.fn()
    function Harness() {
      const [value, setValue] = useState(false)
      return (
        <Switch
          checked={value}
          onCheckedChange={next => {
            onModel(next)
            setValue(next)
          }}
        />
      )
    }
    const w = mount(<Harness />)
    fireEvent.click(w.find('[role="switch"]'))
    expect(emitted(onModel)?.[0]).toEqual([true])
    fireEvent.click(w.find('[role="switch"]'))
    expect(emitted(onModel)?.[1]).toEqual([false])
    const onDisabled = vi.fn()
    const disabled = mount(<Switch disabled onCheckedChange={onDisabled} />)
    fireEvent.click(disabled.find('[role="switch"]'))
    expect(emitted(onDisabled)).toBeUndefined()
  })
})

describe('无障碍', () => {
  it('有文字与仅 aria-label 两种形态均无违规', async () => {
    const labelled = mount(
      <Switch checked description="播放完自动跳到下一话">
        自动播放
      </Switch>,
    )
    await expectNoA11yViolations(labelled.element)
    const bare = mount(<Switch aria-label="自动播放" />)
    await expectNoA11yViolations(bare.element)
  })
})
