import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createSSRApp, h, ref, type Component, type VNode } from 'vue'
import { renderToString } from 'vue/server-renderer'
import * as Reka from 'reka-ui'
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
} from './index'

type Parts = Record<'Root' | 'Input' | 'Increment' | 'Decrement', Component>

const engines: Record<'reka' | 'hina', Parts> = {
  reka: {
    Root: Reka.NumberFieldRoot,
    Input: Reka.NumberFieldInput,
    Increment: Reka.NumberFieldIncrement,
    Decrement: Reka.NumberFieldDecrement,
  },
  hina: {
    Root: NumberFieldRoot,
    Input: NumberFieldInput,
    Increment: NumberFieldIncrement,
    Decrement: NumberFieldDecrement,
  },
}

interface Scenario {
  root?: Record<string, unknown>
  input?: Record<string, unknown>
  increment?: Record<string, unknown>
  decrement?: Record<string, unknown>
  child?: boolean
  form?: boolean
  locale?: string
}

function tree(parts: Parts, scenario: Scenario, root: Record<string, unknown> = {}): VNode {
  const field = h(parts.Root, { ...scenario.root, ...root }, () => [
    h(parts.Input, scenario.input),
    h(parts.Increment, scenario.increment, () =>
      scenario.child ? h('a', { href: '#up', class: 'up' }, 'up') : '+',
    ),
    h(parts.Decrement, scenario.decrement, () => '-'),
  ])
  const scoped = scenario.locale
    ? h(Reka.ConfigProvider, { locale: scenario.locale }, () => field)
    : field
  return scenario.form ? h('form', null, [scoped]) : scoped
}

const scenarios: Record<string, Scenario> = {
  'empty field': {},
  'controlled value with bounds': {
    root: { modelValue: 5, min: 0, max: 10 },
    input: { placeholder: 'qty', 'aria-label': 'qty' },
  },
  'at the maximum with a decimal step': { root: { modelValue: 10, min: 0, max: 10, step: 0.5 } },
  'at the minimum': { root: { modelValue: 0, min: 0, max: 10 } },
  'null model': { root: { modelValue: null } },
  'default value with currency': {
    root: { defaultValue: 1234.5, formatOptions: { style: 'currency', currency: 'CNY' } },
  },
  'integer format': { root: { modelValue: 3, formatOptions: { maximumFractionDigits: 0 } } },
  'locale from the config provider': {
    root: { modelValue: 0.25, formatOptions: { style: 'percent' } },
    locale: 'de-DE',
  },
  'disabled and readonly': { root: { modelValue: 4, disabled: true, readonly: true } },
  'id, attributes and classes on every part': {
    root: { id: 'field', class: 'root', 'data-x': '1', modelValue: 2 },
    input: { class: 'input', id: 'own' },
    increment: { class: 'up', 'aria-label': 'more', disabled: true },
    decrement: { class: 'down', style: { color: 'red' } },
  },
  'as and asChild': {
    root: { as: 'span', modelValue: 1 },
    increment: { asChild: true },
    decrement: { as: 'span' },
    child: true,
  },
  'form field': {
    root: { name: 'qty', required: true, modelValue: 3, min: 0 },
    form: true,
  },
  'form field outside a form': { root: { name: 'qty', modelValue: 3 } },
}

describe('server markup matches Reka', () => {
  for (const [name, scenario] of Object.entries(scenarios))
    it(name, async () => {
      const [reka, hina] = await Promise.all(
        [engines.reka, engines.hina].map(parts =>
          renderToString(createSSRApp({ render: () => tree(parts, scenario) })),
        ),
      )
      expect(hina).toBe(reka)
    })
})

let wrappers: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  wrappers.forEach(wrapper => wrapper.unmount())
  wrappers = []
  vi.useRealTimers()
})

function mountField(engine: keyof typeof engines, scenario: Scenario, controlled: boolean) {
  const emitted: unknown[] = []
  const model = ref(scenario.root?.modelValue as number | null | undefined)
  const wrapper = mount(
    {
      render: () =>
        tree(engines[engine], scenario, {
          ...(controlled ? { modelValue: model.value } : {}),
          'onUpdate:modelValue': (value: number | undefined) => {
            emitted.push(value)
            if (controlled) model.value = value
          },
        }),
    },
    { attachTo: document.body },
  )
  wrappers.push(wrapper)
  return { wrapper, emitted, input: wrapper.find('input:not([aria-hidden])') }
}

type Field = ReturnType<typeof mountField>

async function settle() {
  if (vi.isFakeTimers()) return void (await vi.advanceTimersByTimeAsync(20))
  await new Promise(resolve => setTimeout(resolve, 0))
  await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
}

async function run(
  engine: keyof typeof engines,
  scenario: Scenario,
  act: (field: Field) => Promise<unknown> | unknown,
  controlled: boolean,
) {
  const field = mountField(engine, scenario, controlled)
  await settle()
  const result = await act(field)
  await settle()
  const snapshot = {
    html: field.wrapper.html(),
    value: (field.input.element as HTMLInputElement).value,
    emitted: field.emitted,
    result,
  }
  field.wrapper.unmount()
  wrappers = wrappers.filter(wrapper => wrapper !== field.wrapper)
  document.body.innerHTML = ''
  return snapshot
}

async function compare(
  scenario: Scenario,
  act: (field: Field) => Promise<unknown> | unknown,
  controlled = false,
) {
  const reka = await run('reka', scenario, act, controlled)
  const hina = await run('hina', scenario, act, controlled)
  expect(hina).toEqual(reka)
  return hina
}

describe('client behaviour matches Reka', () => {
  for (const controlled of [false, true])
    describe(controlled ? 'controlled' : 'uncontrolled', () => {
      it('keyboard stepping, paging and bounds', async () => {
        const result = await compare(
          { root: { modelValue: 5, min: 1, max: 40 } },
          async ({ input }) => {
            for (const key of [
              'ArrowUp',
              'ArrowUp',
              'ArrowDown',
              'PageUp',
              'Home',
              'End',
              'PageDown',
            ])
              await input.trigger('keydown', { key })
          },
          controlled,
        )
        expect(result.emitted.length).toBeGreaterThan(0)
      })

      it('typing, Enter and blur parse and clamp', async () => {
        await compare(
          { root: { min: 0, max: 10, formatOptions: { maximumFractionDigits: 1 } } },
          async ({ input }) => {
            await input.setValue('99')
            await input.trigger('keydown', { key: 'Enter' })
            await input.setValue('3.46')
            await input.trigger('blur')
            await input.setValue('')
            await input.trigger('blur')
            await input.setValue('abc')
            await input.trigger('blur')
          },
          controlled,
        )
      })

      it('clearing the text keeps it empty even when the parent ignores the update', async () => {
        const result = await compare(
          { root: { modelValue: 3, min: 0 } },
          async ({ input }) => {
            ;(input.element as HTMLInputElement).value = ''
            await input.trigger('input')
            await input.trigger('blur')
          },
          controlled,
        )
        expect(result.value).toBe('')
      })

      it('committed text shows the model the parent keeps', async () => {
        await compare(
          { root: { modelValue: 3, min: 0 } },
          async ({ input }) => {
            await input.setValue('7')
            await input.trigger('keydown', { key: 'Enter' })
          },
          controlled,
        )
      })

      it('beforeinput rejects invalid characters', async () => {
        const result = await compare(
          { root: { min: 0 } },
          ({ input }) =>
            ['a', '1', '-', '.'].map(data => {
              const event = new InputEvent('beforeinput', {
                data,
                inputType: 'insertText',
                cancelable: true,
              })
              input.element.dispatchEvent(event)
              return event.defaultPrevented
            }),
          controlled,
        )
        expect(result.result).toEqual([true, false, true, false])
      })

      it('the wheel steps only while focused', async () => {
        await compare(
          { root: { modelValue: 2 } },
          async ({ input }) => {
            await input.trigger('wheel', { deltaY: 10 })
            ;(input.element as HTMLInputElement).focus()
            await input.trigger('wheel', { deltaY: 10 })
            await input.trigger('wheel', { deltaY: -10 })
            await input.trigger('wheel', { deltaY: -10 })
            await input.trigger('wheel', { deltaY: 1, deltaX: 5 })
          },
          controlled,
        )
      })

      it('press and hold repeats until release or the limit', async () => {
        vi.useFakeTimers()
        await compare(
          { root: { modelValue: 7, max: 9.5, step: 0.5 } },
          async ({ wrapper }) => {
            const up = wrapper.findAll('button')[0]!.element
            up.dispatchEvent(new PointerEvent('pointerdown', { button: 0, cancelable: true }))
            await vi.advanceTimersByTimeAsync(400)
            await vi.advanceTimersByTimeAsync(60)
            window.dispatchEvent(new PointerEvent('pointerup'))
            await vi.advanceTimersByTimeAsync(200)
            up.dispatchEvent(new PointerEvent('pointerdown', { button: 2, cancelable: true }))
            const down = wrapper.findAll('button')[1]!.element
            down.dispatchEvent(new PointerEvent('pointerdown', { button: 0, cancelable: true }))
            await vi.advanceTimersByTimeAsync(1000)
            window.dispatchEvent(new PointerEvent('pointercancel'))
            await vi.advanceTimersByTimeAsync(0)
          },
          controlled,
        )
      })

      it('the hidden form input follows the value', async () => {
        await compare(
          { root: { name: 'qty', modelValue: 3 }, form: true },
          async ({ input }) => {
            await input.trigger('keydown', { key: 'ArrowUp' })
          },
          controlled,
        )
      })
    })
})
