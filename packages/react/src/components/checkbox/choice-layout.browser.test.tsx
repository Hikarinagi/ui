import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ComponentType } from 'react'
import { Checkbox } from './Checkbox'
import { Switch } from '../switch/Switch'
import { CheckboxGroup } from '../checkbox-group/CheckboxGroup'
import { RadioGroup } from '../radio-group/RadioGroup'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

type Props = Record<string, unknown>

async function build(Component: ComponentType<Props>, props: Props, label?: string, dir = 'ltr') {
  const host = document.createElement('div')
  host.style.width = '280px'
  host.dir = dir
  document.body.appendChild(host)
  const state = signal<Props>(props)
  const onModel: Mock = vi.fn()
  const model =
    Component === (Checkbox as unknown) || Component === (Switch as unknown)
      ? { onCheckedChange: onModel }
      : { onValueChange: onModel }
  function Harness() {
    const current = state.use()
    return (
      <Component {...current} {...model} aria-label="Preferences" dir={dir}>
        {label}
      </Component>
    )
  }
  await render(<Harness />, { container: host })
  const element = host.firstElementChild as HTMLElement
  const w = {
    element,
    get: (selector: string) => element.querySelector(selector) as HTMLElement,
    findAll: (selector: string) => [...element.querySelectorAll<HTMLElement>(selector)],
    emitted: () => (onModel.mock.calls.length ? onModel.mock.calls : undefined),
    setProps: async (next: Props) => {
      state.value = { ...state.value, ...next }
      await tick()
    },
  }
  return { w, host }
}
const rect = (el: Element) => el.getBoundingClientRect()
const close = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(1)
const trigger = (el: Element) =>
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

for (const [name, component, role, width] of [
  ['Checkbox', Checkbox, 'checkbox', 16],
  ['Switch', Switch, 'switch', 40],
] as const) {
  const Component = component as ComponentType<Props>
  describe(`${name} placement`, () => {
    for (const dir of ['ltr', 'rtl']) {
      for (const placement of ['start', 'end']) {
        it(`${dir} / ${placement}: fills the row without stretching the control or separating its description`, async () => {
          const { w, host } = await build(
            Component,
            {
              controlPlacement: placement,
              block: true,
              description:
                'A long description that wraps across several lines in a narrow settings panel.',
            },
            'Sync reading progress',
            dir,
          )
          const control = w.get(`[role="${role}"]`)
          const [title, description] = w.findAll(':scope > span')
          close(rect(w.element).width, rect(host).width)
          close(rect(control).width, width)
          const onRight = (placement === 'end') === (dir === 'ltr')
          close(
            onRight ? rect(control).right : rect(control).left,
            onRight ? rect(host).right : rect(host).left,
          )
          close(rect(title!).left, rect(description!).left)
          expect(rect(description!).top).toBeGreaterThanOrEqual(rect(title!).bottom)
          expect(host.scrollWidth).toBe(host.clientWidth)
          await userEvent.click(description!)
          expect(w.emitted()?.[0]).toEqual([true])
          await w.setProps({ disabled: true })
          trigger(w.get(':scope > span'))
          expect(w.emitted()).toHaveLength(1)
        })
      }
    }
    it('placement and width are independent, and bare controls have no phantom gap', async () => {
      const { w, host } = await build(Component, { controlPlacement: 'end' }, 'Enabled')
      expect(rect(w.element).width).toBeLessThan(rect(host).width)
      await w.setProps({ block: true })
      close(rect(w.element).width, rect(host).width)
      const bare = await build(Component, { controlPlacement: 'end' })
      close(rect(bare.w.element).width, width)
    })
    it('long labels wrap while the control keeps its size and keyboard interaction', async () => {
      const { w, host } = await build(
        Component,
        { controlPlacement: 'end', block: true },
        'A long label that needs multiple lines inside this narrow settings panel',
      )
      host.style.width = '160px'
      const control = w.get(`[role="${role}"]`)
      const title = w.get(':scope > span')
      expect(rect(title).height).toBeGreaterThan(parseFloat(getComputedStyle(title).lineHeight))
      close(rect(control).width, width)
      expect(host.scrollWidth).toBe(host.clientWidth)
      control.focus()
      await userEvent.keyboard(' ')
      expect(w.emitted()?.[0]).toEqual([true])
    })
  })
}

for (const [name, component, role] of [
  ['CheckboxGroup', CheckboxGroup, 'checkbox'],
  ['RadioGroup', RadioGroup, 'radio'],
] as const) {
  const Component = component as unknown as ComponentType<Props>
  describe(`${name} item layout`, () => {
    const options = [
      { value: 'a', label: 'First option', description: 'Supporting text' },
      { value: 'b', label: 'Second option', description: 'More information', disabled: true },
    ]
    for (const dir of ['ltr', 'rtl']) {
      it(`${dir}: vertical items fill the group and retain option-level disabled state`, async () => {
        const { w, host } = await build(
          Component,
          { options, block: true, controlPlacement: 'end' },
          undefined,
          dir,
        )
        const labels = w.findAll('label')
        for (const label of labels) {
          close(rect(label).width, rect(host).width)
          const control = label.querySelector(`[role="${role}"]`)!
          close(rect(control).width, 16)
          close(
            dir === 'ltr' ? rect(control).right : rect(control).left,
            dir === 'ltr' ? rect(host).right : rect(host).left,
          )
        }
        await userEvent.click(labels[0]!.querySelector('span')!)
        expect(w.emitted()?.[0]).toEqual(name === 'RadioGroup' ? ['a'] : [['a']])
        trigger(labels[1]!.querySelector('span')!)
        expect(w.emitted()).toHaveLength(1)
        expect(labels[0]!.getAttribute('data-disabled')).toBeNull()
        expect(labels[1]!.getAttribute('data-disabled')).toBe('')
      })
    }
    it('horizontal block items share the width instead of each taking an entire row', async () => {
      const { w } = await build(Component, {
        options,
        block: true,
        controlPlacement: 'end',
        orientation: 'horizontal',
      })
      const labels = w.findAll('label')
      close(rect(labels[0]!).top, rect(labels[1]!).top)
      close(rect(labels[0]!).width, rect(labels[1]!).width)
      expect(rect(labels[0]!).width).toBeLessThan(rect(w.element).width / 2)
      await w.setProps({ controlPlacement: 'start', block: false })
      expect(rect(labels[0]!.querySelector(`[role="${role}"]`)!).left).toBeLessThan(
        rect(labels[0]!.querySelector('span')!).left,
      )
    })
  })
}
