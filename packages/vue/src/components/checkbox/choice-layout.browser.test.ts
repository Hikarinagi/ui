import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import Checkbox from './Checkbox.vue'
import Switch from '../switch/Switch.vue'
import CheckboxGroup from '../checkbox-group/CheckboxGroup.vue'
import RadioGroup from '../radio-group/RadioGroup.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
})

function build(component: Component, props: Record<string, unknown>, label?: string, dir = 'ltr') {
  const host = document.createElement('div')
  host.style.width = '280px'
  host.dir = dir
  document.body.appendChild(host)
  const w = mount(component, {
    props,
    slots: label ? { default: label } : undefined,
    attrs: { 'aria-label': 'Preferences', dir },
    attachTo: host,
  })
  mounted.push(w)
  return { w, host }
}
const rect = (el: Element) => el.getBoundingClientRect()
const close = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(1)

for (const [name, component, role, width] of [
  ['Checkbox', Checkbox, 'checkbox', 16],
  ['Switch', Switch, 'switch', 40],
] as const) {
  describe(`${name} placement`, () => {
    for (const dir of ['ltr', 'rtl']) {
      for (const placement of ['start', 'end']) {
        it(`${dir} / ${placement}: fills the row without stretching the control or separating its description`, async () => {
          const { w, host } = build(
            component,
            {
              controlPlacement: placement,
              block: true,
              description:
                'A long description that wraps across several lines in a narrow settings panel.',
            },
            'Sync reading progress',
            dir,
          )
          const control = w.get(`[role="${role}"]`).element
          const [title, description] = w.findAll(':scope > span').map(el => el.element)
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
          expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
          await w.setProps({ disabled: true })
          await w.get(':scope > span').trigger('click')
          expect(w.emitted('update:modelValue')).toHaveLength(1)
        })
      }
    }
    it('placement and width are independent, and bare controls have no phantom gap', async () => {
      const { w, host } = build(component, { controlPlacement: 'end' }, 'Enabled')
      expect(rect(w.element).width).toBeLessThan(rect(host).width)
      await w.setProps({ block: true })
      close(rect(w.element).width, rect(host).width)
      const bare = build(component, { controlPlacement: 'end' })
      close(rect(bare.w.element).width, width)
    })
    it('long labels wrap while the control keeps its size and keyboard interaction', async () => {
      const { w, host } = build(
        component,
        { controlPlacement: 'end', block: true },
        'A long label that needs multiple lines inside this narrow settings panel',
      )
      host.style.width = '160px'
      const control = w.get(`[role="${role}"]`).element as HTMLElement
      const title = w.get(':scope > span').element
      expect(rect(title).height).toBeGreaterThan(parseFloat(getComputedStyle(title).lineHeight))
      close(rect(control).width, width)
      expect(host.scrollWidth).toBe(host.clientWidth)
      control.focus()
      await userEvent.keyboard(' ')
      expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
    })
  })
}

for (const [name, component, role] of [
  ['CheckboxGroup', CheckboxGroup, 'checkbox'],
  ['RadioGroup', RadioGroup, 'radio'],
] as const) {
  describe(`${name} item layout`, () => {
    const options = [
      { value: 'a', label: 'First option', description: 'Supporting text' },
      { value: 'b', label: 'Second option', description: 'More information', disabled: true },
    ]
    for (const dir of ['ltr', 'rtl']) {
      it(`${dir}: vertical items fill the group and retain option-level disabled state`, async () => {
        const { w, host } = build(
          component,
          { options, block: true, controlPlacement: 'end' },
          undefined,
          dir,
        )
        const labels = w.findAll('label')
        for (const label of labels) {
          close(rect(label.element).width, rect(host).width)
          const control = label.get(`[role="${role}"]`).element
          close(rect(control).width, 16)
          close(
            dir === 'ltr' ? rect(control).right : rect(control).left,
            dir === 'ltr' ? rect(host).right : rect(host).left,
          )
        }
        await userEvent.click(labels[0]!.get('span').element)
        expect(w.emitted('update:modelValue')?.[0]).toEqual(name === 'RadioGroup' ? ['a'] : [['a']])
        await labels[1]!.get('span').trigger('click')
        expect(w.emitted('update:modelValue')).toHaveLength(1)
        expect(labels[0]!.attributes('data-disabled')).toBeUndefined()
        expect(labels[1]!.attributes('data-disabled')).toBe('')
      })
    }
    it('horizontal block items share the width instead of each taking an entire row', async () => {
      const { w } = build(component, {
        options,
        block: true,
        controlPlacement: 'end',
        orientation: 'horizontal',
      })
      const labels = w.findAll('label')
      close(rect(labels[0]!.element).top, rect(labels[1]!.element).top)
      close(rect(labels[0]!.element).width, rect(labels[1]!.element).width)
      expect(rect(labels[0]!.element).width).toBeLessThan(rect(w.element).width / 2)
      await w.setProps({ controlPlacement: 'start', block: false })
      expect(rect(labels[0]!.get(`[role="${role}"]`).element).left).toBeLessThan(
        rect(labels[0]!.get('span').element).left,
      )
    })
  })
}
