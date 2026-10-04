import { createRef, type ReactNode, type RefObject } from 'react'
import { vi, type Mock } from 'vitest'
import { DataTable } from '../src/components/data-table/DataTable'
import type { DataTableHandle, DataTableProps } from '../src/components/data-table/types'
import { signal, type Signal } from './signal'

const MODELS = [
  'page',
  'pageSize',
  'sorting',
  'filter',
  'columnFilters',
  'grouping',
  'selected',
  'expanded',
  'expandedGroups',
  'hiddenColumns',
  'columnOrder',
  'columnWidths',
  'rows',
] as const

const EVENTS = ['change', 'rowClick', 'rowReorder', 'edit', 'editError', 'rowContextmenu'] as const

type Model = (typeof MODELS)[number]
type Event = (typeof EVENTS)[number]

const capitalize = (name: string) => name[0]!.toUpperCase() + name.slice(1)

export interface TableHarness<T> {
  props: Signal<Partial<DataTableProps<T>>>
  handle: RefObject<DataTableHandle<T> | null>
  element: () => ReactNode
  emitted: (name: `update:${Model}` | Event) => unknown[][] | undefined
  mocks: Record<string, Mock>
}

export function tableHarness<T extends object>(
  initial: Partial<DataTableProps<T>>,
  options: { bind?: boolean; bindRows?: boolean } = {},
): TableHarness<T> {
  const props = signal<Partial<DataTableProps<T>>>(initial)
  const handle = createRef<DataTableHandle<T>>()
  const mocks: Record<string, Mock> = {}
  const handlers: Record<string, (...args: unknown[]) => void> = {}
  for (const name of MODELS) {
    const mock = vi.fn()
    mocks[`update:${name}`] = mock
    handlers[`on${capitalize(name)}Change`] = (value: unknown) => {
      mock(value)
      const user = (props.value as Record<string, unknown>)[`on${capitalize(name)}Change`]
      if (typeof user === 'function') user(value)
      if (name === 'rows' ? options.bindRows : options.bind !== false)
        props.value = { ...props.value, [name]: value }
    }
  }
  for (const name of EVENTS) {
    const mock = vi.fn()
    mocks[name] = mock
    handlers[`on${capitalize(name)}`] = (...args: unknown[]) => {
      mock(...args)
      const user = (props.value as Record<string, unknown>)[`on${capitalize(name)}`]
      if (typeof user === 'function') user(...args)
    }
  }
  function Harness() {
    const current = props.use()
    return (
      <DataTable<T>
        {...(current as DataTableProps<T>)}
        {...(handlers as Partial<DataTableProps<T>>)}
        ref={handle}
      />
    )
  }
  return {
    props,
    handle,
    element: () => <Harness />,
    emitted: name => (mocks[name]!.mock.calls.length ? mocks[name]!.mock.calls : undefined),
    mocks,
  }
}

export async function mountTable<T extends object>(
  initial: Partial<DataTableProps<T>>,
  host: HTMLElement,
  options: { bind?: boolean; bindRows?: boolean } = {},
) {
  const { render } = await import('vitest-browser-react')
  const harness = tableHarness<T>(initial, options)
  const screen = await render(harness.element(), { container: host })
  const element = () => host.firstElementChild as HTMLElement
  return {
    ...harness,
    screen,
    get element() {
      return element()
    },
    find: (selector: string) => element().querySelector<HTMLElement>(selector),
    findAll: (selector: string) => [...element().querySelectorAll<HTMLElement>(selector)],
    setProps: async (next: Partial<DataTableProps<T>>) => {
      harness.props.value = { ...harness.props.value, ...next }
      await new Promise(resolve => setTimeout(resolve, 0))
    },
    unmount: () => screen.unmount(),
  }
}
