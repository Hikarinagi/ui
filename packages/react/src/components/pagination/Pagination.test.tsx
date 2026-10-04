import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render as mount } from '@testing-library/react'
import { Pagination, type PaginationProps } from './Pagination'
import { UiLocaleProvider, enUS, zhCN } from '../../locale'
import { signal } from '../../../test/signal'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

type Props = Partial<PaginationProps>

function render(props: Props = {}) {
  const state = signal<Props>({ total: 200, value: 1, ...props })
  const updates = vi.fn()
  function Harness() {
    const current = state.use()
    return (
      <Pagination
        total={200}
        {...current}
        onValueChange={value => {
          updates(value)
          state.value = { ...state.value, value }
        }}
      />
    )
  }
  const screen = mount(<Harness />)
  const element = screen.container.firstElementChild as HTMLElement
  return {
    element,
    updates,
    find: (selector: string) => element.querySelector<HTMLElement>(selector),
    findAll: (selector: string) => [...element.querySelectorAll<HTMLElement>(selector)],
    setProps: (next: Props) =>
      act(() => {
        state.value = { ...state.value, ...next }
      }),
  }
}

type Wrapper = ReturnType<typeof render>

const values = (w: Wrapper) => w.findAll('[data-type="page"]').map(node => Number(node.textContent))
const action = (w: Wrapper, name: string) => w.find('[data-hn-pagination-action="' + name + '"]')!

describe('Pagination', () => {
  it('renders a named navigation landmark, selected page and disabled boundary controls', () => {
    const w = render({ showFirstLast: true })
    expect(w.find('nav')).not.toBeNull()
    expect(w.find('nav')!.getAttribute('aria-label')).toBe(zhCN.pagination.navLabel)
    expect(w.find('[aria-current="page"]')!.textContent).toBe('1')
    expect(action(w, 'first').getAttribute('disabled')).not.toBeNull()
    expect(action(w, 'prev').getAttribute('disabled')).not.toBeNull()
    expect(action(w, 'next').getAttribute('disabled')).toBeNull()
    expect(action(w, 'last').getAttribute('disabled')).toBeNull()
    expect(w.find('[data-type="page"]')!.getAttribute('aria-label')).toBe(
      zhCN.pagination.pageLabel(1),
    )
    expect(w.findAll('button').every(button => button.getAttribute('type') === 'button')).toBe(true)
    expect(
      w
        .findAll('[data-type="ellipsis"]')
        .every(node => node.getAttribute('aria-haspopup') === 'dialog'),
    ).toBe(true)
  })

  it('uses sibling and edge options to limit page ranges', async () => {
    const w = render({ value: 10 })
    expect(values(w)).toEqual([1, 9, 10, 11, 20])
    expect(w.findAll('[data-type="ellipsis"]')).toHaveLength(2)
    await w.setProps({ siblingCount: 0 })
    expect(values(w)).toEqual([1, 10, 20])
    await w.setProps({ showEdges: false, siblingCount: 1 })
    expect(values(w)).toEqual([9, 10, 11])
    expect(w.findAll('[data-type="ellipsis"]')).toHaveLength(0)
  })

  it('keeps page selection valid as total, page size and the controlled value change', async () => {
    const w = render({ value: 15 })
    await w.setProps({ total: 72 })
    expect(w.find('[aria-current="page"]')!.textContent).toBe('8')
    expect(w.updates.mock.calls.at(-1)).toEqual([8])
    expect(action(w, 'next').getAttribute('disabled')).not.toBeNull()
    await w.setProps({ pageSize: 25 })
    expect(w.find('[aria-current="page"]')!.textContent).toBe('3')
    expect(w.updates.mock.calls.at(-1)).toEqual([3])
    await w.setProps({ value: -4 })
    expect(w.find('[aria-current="page"]')!.textContent).toBe('1')
    expect(w.updates.mock.calls.at(-1)).toEqual([1])
  })

  it('handles empty totals and invalid numeric inputs without invalid ranges', async () => {
    const w = render({ total: 0, value: 3, showFirstLast: true })
    expect(values(w)).toEqual([1])
    expect(
      w
        .findAll('[data-hn-pagination-action]')
        .every(node => node.getAttribute('disabled') !== null),
    ).toBe(true)
    await w.setProps({ total: Number.NaN, pageSize: 0, value: Number.POSITIVE_INFINITY })
    expect(values(w)).toEqual([1])
    await w.setProps({ total: 21.9, pageSize: 10.9, value: 2.8 })
    expect(values(w)).toEqual([1, 2, 3])
    expect(w.find('[aria-current="page"]')!.textContent).toBe('2')
  })

  it('supports custom page content while preserving selection semantics', () => {
    const screen = mount(
      <Pagination
        total={30}
        defaultValue={2}
        renderPage={({ page, selected }) => (
          <span data-active={String(selected)}>{'P' + page}</span>
        )}
      />,
    )
    const current = screen.container.querySelector('[aria-current="page"]')!
    expect(current.textContent).toBe('P2')
    expect(current.querySelector('span[data-active]')!.getAttribute('data-active')).toBe('true')
    expect(current.getAttribute('aria-label')).toBe(zhCN.pagination.pageLabel(2))
  })

  it('localizes navigation and page labels and passes accessibility checks', async () => {
    const screen = mount(
      <UiLocaleProvider messages={enUS}>
        <Pagination total={200} defaultValue={10} showFirstLast label="Results pages" />
      </UiLocaleProvider>,
    )
    const element = screen.container.firstElementChild as HTMLElement
    expect(element.querySelector('nav')!.getAttribute('aria-label')).toBe('Results pages')
    expect(
      element.querySelector('[data-hn-pagination-action="last"]')!.getAttribute('aria-label'),
    ).toBe(enUS.pagination.last)
    expect(element.querySelector('[aria-current="page"]')!.getAttribute('aria-label')).toBe(
      enUS.pagination.pageLabel(10),
    )
    await expectNoA11yViolations(element)
  })
})
