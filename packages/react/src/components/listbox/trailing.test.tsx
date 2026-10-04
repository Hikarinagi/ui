import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Listbox, type ListboxProps, type ListboxSlotProps, type ListboxValue } from './Listbox'
import { signal } from '../../../test/signal'
import type { SelectItems, SelectOption } from '../select/types'

afterEach(cleanup)

const options: SelectItems = [
  { value: 0, label: 'Zero' },
  { value: '0', label: 'String zero' },
  {
    label: 'Group',
    options: [
      { value: '', label: 'Empty string' },
      { value: 'grouped', label: 'Grouped' },
    ],
  },
]
type SlotProps = ListboxSlotProps<SelectOption>
type Slots = Partial<Record<'renderOption' | 'renderTrailing', (props: SlotProps) => ReactNode>>

function build(props: Partial<ListboxProps> = {}, slots: Slots = {}) {
  const model = signal<ListboxValue>(props.value)
  function Harness() {
    const value = model.use()
    return <Listbox options={options} {...props} {...slots} value={value} />
  }
  const element = render(<Harness />).container.firstElementChild as HTMLElement
  return {
    element,
    setValue: (value: ListboxValue) =>
      act(() => {
        model.value = value
      }),
  }
}
function states(element: HTMLElement, selector: string) {
  return [...element.querySelectorAll(selector)].map(el => el.getAttribute('data-selected'))
}
const stateSlot = ({ option, selected }: SlotProps) => (
  <span data-selected={String(selected)}>{option.label}</span>
)
const rows = (element: HTMLElement) => [...element.querySelectorAll('[role="option"]')]

describe('Listbox trailing slots', () => {
  it('option and trailing agree with aria-selected for numeric, string, empty and cleared single values', async () => {
    const w = build({ value: 0 }, { renderOption: stateSlot, renderTrailing: stateSlot })
    for (const value of [0, '0', '', 'grouped', null, undefined]) {
      await w.setValue(value)
      const expected = [0, '0', '', 'grouped'].map(v => String(v === value))
      expect(states(w.element, '[role="option"] > span:first-child > span')).toEqual(expected)
      expect(states(w.element, '[role="option"] > span:last-child')).toEqual(expected)
      expect(rows(w.element).map(row => row.getAttribute('aria-selected'))).toEqual(expected)
    }
  })

  it('multi-selection and external updates reach grouped and plain custom content', async () => {
    const w = build({ multiple: true, value: [0, 'grouped'] }, { renderTrailing: stateSlot })
    expect(states(w.element, '[data-selected]')).toEqual(['true', 'false', 'false', 'true'])
    await w.setValue(['0', ''])
    expect(states(w.element, '[data-selected]')).toEqual(['false', 'true', 'true', 'false'])
    await w.setValue([])
    expect(states(w.element, '[data-selected]')).toEqual(['false', 'false', 'false', 'false'])
  })

  it('without trailing, the default indicator remains even when only option is customised', () => {
    const w = build({ value: 'grouped' }, { renderOption: stateSlot })
    const all = rows(w.element)
    expect(all.every(row => row.children.length === 2)).toBe(true)
    expect(all[3]!.querySelector('svg')).not.toBeNull()
    expect(all[0]!.querySelector('svg')).toBeNull()
  })

  for (const [name, empty] of [
    ['empty array', () => []],
    ['conditional comment', () => null],
    ['empty fragment', () => <></>],
  ] as const) {
    it(`${name} intentionally removes the tail, including on selected rows`, () => {
      const w = build({ value: 'grouped' }, { renderTrailing: empty })
      expect(rows(w.element).every(row => row.children.length === 1)).toBe(true)
      expect(w.element.querySelector('svg')).toBeNull()
    })
  }

  it('reactive counts and per-option empty content update without reselecting', async () => {
    const counts = signal<Record<string, number>>({ '0': 12, '': 6, grouped: 4 })
    const hidden = signal(false)
    function Harness() {
      const current = counts.use()
      const isHidden = hidden.use()
      return (
        <Listbox
          options={options}
          value={0}
          renderTrailing={({ option, selected }) =>
            isHidden || option.value === '' ? null : (
              <span data-tail="">{selected ? 'check' : current[option.value]}</span>
            )
          }
        />
      )
    }
    const element = render(<Harness />).container.firstElementChild as HTMLElement
    const tails = () => [...element.querySelectorAll('[data-tail]')]
    expect(tails().map(el => el.textContent)).toEqual(['check', '12', '4'])
    await act(() => {
      counts.value = { ...counts.value, grouped: 999 }
    })
    expect(tails().at(-1)!.textContent).toBe('999')
    await act(() => {
      hidden.value = true
    })
    expect(rows(element).every(row => row.children.length === 1)).toBe(true)
    await act(() => {
      hidden.value = false
    })
    expect(tails()).toHaveLength(3)
  })
})

it('updates option data and the presence of a trailing slot without changing selection', async () => {
  const state = signal({ custom: false, label: 'Before' })
  function Harness() {
    const current = state.use()
    return (
      <Listbox
        options={[{ value: 'one', label: current.label }]}
        value="one"
        renderTrailing={
          current.custom
            ? ({ option }: SlotProps) => <span data-tail="">{option.label}</span>
            : undefined
        }
      />
    )
  }
  const element = render(<Harness />).container.firstElementChild as HTMLElement
  expect(element.querySelector('svg')).not.toBeNull()
  await act(() => {
    state.value = { ...state.value, custom: true }
  })
  expect(element.querySelector('[data-tail]')!.textContent).toBe('Before')
  expect(element.querySelector('svg')).toBeNull()
  await act(() => {
    state.value = { ...state.value, label: 'After' }
  })
  expect(element.querySelector('[data-tail]')!.textContent).toBe('After')
  await act(() => {
    state.value = { ...state.value, custom: false }
  })
  expect(element.querySelector('[data-tail]')).toBeNull()
  expect(element.querySelector('svg')).not.toBeNull()
})
