import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, type Component } from 'vue'
import FormField from './FormField.vue'
import FormLayout from '../form-layout/FormLayout.vue'
import Input from '../input/Input.vue'
import Switch from '../switch/Switch.vue'
import RadioGroup from '../radio-group/RadioGroup.vue'
import CheckboxGroup from '../checkbox-group/CheckboxGroup.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
})
function host(width = 700) {
  const el = document.createElement('div')
  el.style.width = `${width}px`
  document.body.appendChild(el)
  return el
}
const rect = (el: Element) => el.getBoundingClientRect()
const close = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(1)
function field(label: string, props: Record<string, unknown> = {}) {
  return h(FormField, { label, ...props }, () => h(Input))
}

for (const orientation of ['vertical', 'horizontal', 'responsive'] as const) {
  for (const descriptionPlacement of ['label', 'control'] as const) {
    for (const width of [400, 700]) {
      it(`${orientation} / ${descriptionPlacement} / ${width}px: label, description and error stay in their intended areas`, async () => {
        const container = host(width)
        const w = mount(FormField, {
          attachTo: container,
          props: {
            label: 'Display name',
            description: 'Shown on your profile',
            error: 'Please enter a name',
            orientation,
            descriptionPlacement,
            labelWidth: 120,
          },
          slots: {
            default: () => h(Input, { id: 'display-name', 'aria-describedby': 'external-help' }),
          },
        })
        mounted.push(w)
        await nextTick()
        const label = w.get('label').element
        const control = w.get('[data-hn-form-field-control]').element
        const input = w.get('input').element
        const description = w.get('p:not([aria-live])').element
        const message = w.get('p[aria-live]').element
        const horizontal =
          orientation === 'horizontal' || (orientation === 'responsive' && width >= 512)
        if (horizontal) {
          close(rect(control).left - rect(container).left, 144)
          close(rect(control).top, rect(label).top)
        } else {
          close(rect(control).left, rect(container).left)
          expect(rect(control).top).toBeGreaterThanOrEqual(rect(label).bottom)
        }
        const anchor = descriptionPlacement === 'label' ? label : control
        close(rect(description).left, rect(anchor).left)
        expect(rect(description).top).toBeGreaterThanOrEqual(rect(anchor).bottom)
        close(rect(message).left, rect(control).left)
        expect(rect(message).top).toBeGreaterThanOrEqual(rect(control).bottom)
        expect(container.scrollWidth).toBe(container.clientWidth)
        expect(label.getAttribute('for')).toBe(input.id)
        expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual([
          'external-help',
          description.id,
          message.id,
        ])
        await userEvent.click(label)
        expect(document.activeElement).toBe(input)
      })
    }
  }
}

describe('FormField responsive and composition', () => {
  it('responds to its own container width and keeps input state and description identity', async () => {
    const container = host()
    const w = mount(FormField, {
      attachTo: container,
      props: { label: 'Name', orientation: 'responsive', description: 'Public name' },
      slots: { default: () => h(Input) },
    })
    mounted.push(w)
    const input = w.get('input').element
    const descriptionId = w.get('p').attributes('id')
    await userEvent.fill(input, 'Hina')
    container.style.width = '280px'
    await vi.waitFor(() =>
      expect(rect(input).top).toBeGreaterThan(rect(w.get('label').element).bottom),
    )
    await w.setProps({ descriptionPlacement: 'label' })
    expect(w.get('input').element).toBe(input)
    expect(input.value).toBe('Hina')
    expect(w.get('p').attributes('id')).toBe(descriptionId)
    expect(input.getAttribute('aria-describedby')).toBe(descriptionId)
    container.style.width = '700px'
    await vi.waitFor(() =>
      expect(rect(input).left).toBeGreaterThan(rect(w.get('label').element).right),
    )
  })

  it('a field with no heading lets a settings switch fill the whole row', () => {
    const container = host()
    const w = mount(FormField, {
      attachTo: container,
      props: { orientation: 'horizontal', error: 'Save failed' },
      slots: {
        default: () => h(Switch, { block: true, controlPlacement: 'end' }, () => 'Sync progress'),
      },
    })
    mounted.push(w)
    close(rect(w.get('[data-hn-switch]').element).width, rect(container).width)
    close(rect(w.get('[role="switch"]').element).right, rect(container).right)
    close(rect(w.get('p[aria-live]').element).left, rect(container).left)
  })

  it('slots work without label/description props, and disabling still reaches the input', async () => {
    const w = mount(FormField, {
      attachTo: host(),
      props: { orientation: 'horizontal', descriptionPlacement: 'label', disabled: true },
      slots: {
        label: () => 'Name',
        description: () => h('em', 'Visible to everyone'),
        default: () => h(Input),
      },
    })
    mounted.push(w)
    expect(w.get('input').element.disabled).toBe(true)
    expect(rect(w.get('p').element).right).toBeLessThan(rect(w.get('input').element).left)
    expect(w.get('input').attributes('aria-describedby')).toBe(w.get('p').attributes('id'))
    await w.setProps({ disabled: false })
    expect(w.get('input').element.disabled).toBe(false)
  })

  for (const [name, component, selector] of [
    ['RadioGroup', RadioGroup, '[role="radiogroup"]'],
    ['CheckboxGroup', CheckboxGroup, '[role="group"]'],
  ] as const) {
    it(`${name} keeps group labelling separate from option labels`, () => {
      const w = mount(FormField, {
        attachTo: host(),
        props: {
          label: 'Visibility',
          orientation: 'horizontal',
          descriptionPlacement: 'label',
          description: 'Who can read this',
          error: 'Choose an option',
        },
        slots: {
          default: () =>
            h(component as Component, { options: [{ label: 'Public', value: 'public' }] }),
        },
      })
      mounted.push(w)
      const group = w.get(selector)
      expect(group.attributes('aria-labelledby')).toBe(w.get('label').attributes('id'))
      const ids = group.attributes('aria-describedby')!.split(' ')
      expect(ids).toEqual(w.findAll('p').map(p => p.attributes('id')))
      expect(w.findAll('label label')).toHaveLength(0)
    })
  }
})

describe('FormLayout shared columns', () => {
  it('aligns different labels, updates inherited settings, and allows per-field overrides', async () => {
    const w = mount(FormLayout, {
      attachTo: host(),
      props: { orientation: 'horizontal', labelWidth: 140, descriptionPlacement: 'label' },
      slots: {
        default: () => [
          field('Name', { description: 'Public' }),
          field('Email address'),
          field('Notes', { labelWidth: 200 }),
          field('Stacked', { orientation: 'vertical' }),
        ],
      },
    })
    mounted.push(w)
    const inputs = w.findAll('[data-hn-form-field-control]').map(w => w.element)
    close(rect(inputs[0]!).left, rect(inputs[1]!).left)
    close(rect(inputs[2]!).left - rect(inputs[0]!).left, 60)
    close(rect(inputs[3]!).left, rect(w.element).left)
    await w.setProps({ labelWidth: 180, orientation: 'responsive' })
    close(rect(inputs[0]!).left - rect(w.element).left, 204)
    close(rect(inputs[2]!).left - rect(w.element).left, 224)
    expect(w.findAll('[data-hn-form-field]')[3]!.attributes('data-orientation')).toBe('vertical')
  })

  it('fields in a multi-column form respond to their own column, not the entire form', async () => {
    await page.viewport(1024, 768)
    const w = mount(FormLayout, {
      attachTo: host(800),
      props: { orientation: 'responsive', columns: 2 },
      slots: { default: () => [field('Name'), field('Email')] },
    })
    mounted.push(w)
    for (const item of w.findAll('[data-hn-form-field]')) {
      expect(rect(item.get('input').element).top).toBeGreaterThan(
        rect(item.get('label').element).bottom,
      )
    }
  })

  it('nested layouts inherit defaults and scope their overrides to their descendants', async () => {
    const w = mount(FormLayout, {
      attachTo: host(),
      props: { orientation: 'horizontal', labelWidth: 120 },
      slots: {
        default: () => [field('Outer'), h(FormLayout, { labelWidth: 180 }, () => field('Inner'))],
      },
    })
    mounted.push(w)
    const inputs = w.findAll('[data-hn-form-field-control]').map(w => w.element)
    close(rect(inputs[1]!).left - rect(inputs[0]!).left, 60)
    await w.setProps({ orientation: 'vertical' })
    close(rect(inputs[1]!).left, rect(inputs[0]!).left)
  })
})
