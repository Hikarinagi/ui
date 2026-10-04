import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { FormField, type FormFieldProps } from './FormField'
import { FormLayout, type FormLayoutProps } from '../form-layout/FormLayout'
import { Input } from '../input/Input'
import { Switch } from '../switch/Switch'
import { RadioGroup } from '../radio-group/RadioGroup'
import { CheckboxGroup } from '../checkbox-group/CheckboxGroup'
import '../../../test/browser.css'

afterEach(() => {
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

function field(label: string, props: Partial<FormFieldProps> = {}) {
  return (
    <FormField key={label} label={label} {...props}>
      <Input />
    </FormField>
  )
}

async function draw(container: HTMLElement, ui: ReactNode) {
  const screen = await render(ui, { container })
  return { ...screen, element: container.firstElementChild as HTMLElement }
}

for (const orientation of ['vertical', 'horizontal', 'responsive'] as const) {
  for (const descriptionPlacement of ['label', 'control'] as const) {
    for (const width of [400, 700]) {
      it(`${orientation} / ${descriptionPlacement} / ${width}px: label, description and error stay in their intended areas`, async () => {
        const container = host(width)
        const w = await draw(
          container,
          <FormField
            label="Display name"
            description="Shown on your profile"
            error="Please enter a name"
            orientation={orientation}
            descriptionPlacement={descriptionPlacement}
            labelWidth={120}
          >
            <Input id="display-name" aria-describedby="external-help" />
          </FormField>,
        )
        const label = w.element.querySelector('label')!
        const control = w.element.querySelector('[data-hn-form-field-control]')!
        const input = w.element.querySelector('input')!
        const description = w.element.querySelector('p:not([aria-live])')!
        const message = w.element.querySelector('p[aria-live]')!
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
    const ui = (props: Partial<FormFieldProps>) => (
      <FormField label="Name" orientation="responsive" description="Public name" {...props}>
        <Input />
      </FormField>
    )
    const w = await draw(container, ui({}))
    const input = w.element.querySelector('input')!
    const descriptionId = w.element.querySelector('p')!.getAttribute('id')
    await userEvent.fill(input, 'Hina')
    container.style.width = '280px'
    await vi.waitFor(() =>
      expect(rect(input).top).toBeGreaterThan(rect(w.element.querySelector('label')!).bottom),
    )
    await w.rerender(ui({ descriptionPlacement: 'label' }))
    expect(w.element.querySelector('input')).toBe(input)
    expect(input.value).toBe('Hina')
    expect(w.element.querySelector('p')!.getAttribute('id')).toBe(descriptionId)
    expect(input.getAttribute('aria-describedby')).toBe(descriptionId)
    container.style.width = '700px'
    await vi.waitFor(() =>
      expect(rect(input).left).toBeGreaterThan(rect(w.element.querySelector('label')!).right),
    )
  })

  it('a field with no heading lets a settings switch fill the whole row', async () => {
    const container = host()
    const w = await draw(
      container,
      <FormField orientation="horizontal" error="Save failed">
        <Switch block controlPlacement="end">
          Sync progress
        </Switch>
      </FormField>,
    )
    close(rect(w.element.querySelector('[data-hn-switch]')!).width, rect(container).width)
    close(rect(w.element.querySelector('[role="switch"]')!).right, rect(container).right)
    close(rect(w.element.querySelector('p[aria-live]')!).left, rect(container).left)
  })

  it('slots work without label/description props, and disabling still reaches the input', async () => {
    const container = host()
    const ui = (disabled: boolean) => (
      <FormField
        orientation="horizontal"
        descriptionPlacement="label"
        disabled={disabled}
        label="Name"
        description={<em>Visible to everyone</em>}
      >
        <Input />
      </FormField>
    )
    const w = await draw(container, ui(true))
    const input = () => w.element.querySelector('input')!
    expect(input().disabled).toBe(true)
    expect(rect(w.element.querySelector('p')!).right).toBeLessThan(rect(input()).left)
    expect(input().getAttribute('aria-describedby')).toBe(
      w.element.querySelector('p')!.getAttribute('id'),
    )
    await w.rerender(ui(false))
    expect(input().disabled).toBe(false)
  })

  for (const [name, Component, selector] of [
    ['RadioGroup', RadioGroup, '[role="radiogroup"]'],
    ['CheckboxGroup', CheckboxGroup, '[role="group"]'],
  ] as const) {
    it(`${name} keeps group labelling separate from option labels`, async () => {
      const w = await draw(
        host(),
        <FormField
          label="Visibility"
          orientation="horizontal"
          descriptionPlacement="label"
          description="Who can read this"
          error="Choose an option"
        >
          <Component options={[{ label: 'Public', value: 'public' }]} />
        </FormField>,
      )
      const group = w.element.querySelector(selector)!
      expect(group.getAttribute('aria-labelledby')).toBe(
        w.element.querySelector('label')!.getAttribute('id'),
      )
      const ids = group.getAttribute('aria-describedby')!.split(' ')
      expect(ids).toEqual([...w.element.querySelectorAll('p')].map(p => p.getAttribute('id')))
      expect(w.element.querySelectorAll('label label')).toHaveLength(0)
    })
  }
})

describe('FormLayout shared columns', () => {
  it('aligns different labels, updates inherited settings, and allows per-field overrides', async () => {
    const container = host()
    const ui = (props: Partial<FormLayoutProps>) => (
      <FormLayout {...props}>
        {field('Name', { description: 'Public' })}
        {field('Email address')}
        {field('Notes', { labelWidth: 200 })}
        {field('Stacked', { orientation: 'vertical' })}
      </FormLayout>
    )
    const w = await draw(
      container,
      ui({ orientation: 'horizontal', labelWidth: 140, descriptionPlacement: 'label' }),
    )
    const inputs = [...w.element.querySelectorAll('[data-hn-form-field-control]')]
    close(rect(inputs[0]!).left, rect(inputs[1]!).left)
    close(rect(inputs[2]!).left - rect(inputs[0]!).left, 60)
    close(rect(inputs[3]!).left, rect(w.element).left)
    await w.rerender(
      ui({ orientation: 'responsive', labelWidth: 180, descriptionPlacement: 'label' }),
    )
    close(rect(inputs[0]!).left - rect(w.element).left, 204)
    close(rect(inputs[2]!).left - rect(w.element).left, 224)
    expect(
      w.element.querySelectorAll('[data-hn-form-field]')[3]!.getAttribute('data-orientation'),
    ).toBe('vertical')
  })

  it('fields in a multi-column form respond to their own column, not the entire form', async () => {
    await page.viewport(1024, 768)
    const w = await draw(
      host(800),
      <FormLayout orientation="responsive" columns={2}>
        {field('Name')}
        {field('Email')}
      </FormLayout>,
    )
    for (const item of w.element.querySelectorAll('[data-hn-form-field]')) {
      expect(rect(item.querySelector('input')!).top).toBeGreaterThan(
        rect(item.querySelector('label')!).bottom,
      )
    }
  })

  it('nested layouts inherit defaults and scope their overrides to their descendants', async () => {
    const container = host()
    const ui = (props: Partial<FormLayoutProps>) => (
      <FormLayout {...props}>
        {field('Outer')}
        <FormLayout labelWidth={180}>{field('Inner')}</FormLayout>
      </FormLayout>
    )
    const w = await draw(container, ui({ orientation: 'horizontal', labelWidth: 120 }))
    const inputs = [...w.element.querySelectorAll('[data-hn-form-field-control]')]
    close(rect(inputs[1]!).left - rect(inputs[0]!).left, 60)
    await w.rerender(ui({ orientation: 'vertical', labelWidth: 120 }))
    close(rect(inputs[1]!).left, rect(inputs[0]!).left)
  })
})
