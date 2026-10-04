import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { cleanup, render } from 'vitest-browser-react'
import { Pagination, type PaginationProps } from './Pagination'
import { UiLocaleProvider, enUS } from '../../locale'
import { PaginationContent } from './PaginationContent'
import { PaginationInfo } from './PaginationInfo'
import { PaginationSize } from './PaginationSize'
import { PaginationJump } from './PaginationJump'
import { expectNoA11yViolations } from '../../../test/axe'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1100, 720)
})
afterEach(async () => {
  await cleanup()
})

async function mount(ui: React.ReactNode) {
  const screen = await render(ui)
  const element = screen.container.firstElementChild as HTMLElement
  const find = (selector: string) =>
    element.matches(selector) ? element : element.querySelector<HTMLElement>(selector)
  return {
    element,
    get: (selector: string) => find(selector)!,
    find,
    findAll: (selector: string) => [...element.querySelectorAll<HTMLElement>(selector)],
  }
}

async function setup(props: Partial<PaginationProps> = {}) {
  const current = signal(10)
  const pageSize = signal(10)
  const total = signal(250)
  const pending = signal(false)
  const change = vi.fn()
  function Harness() {
    return (
      <Pagination
        value={current.use()}
        pageSize={pageSize.use()}
        total={total.use()}
        pending={pending.use()}
        showInfo
        showJump
        pageSizeOptions={[10, 20, 50]}
        {...props}
        onValueChange={value => {
          current.value = value
        }}
        onPageSizeChange={value => {
          pageSize.value = value
        }}
        onChange={change}
      />
    )
  }
  const w = await mount(<Harness />)
  return { w, current, pageSize, total, pending, change }
}

describe('Pagination state and composition', () => {
  it('submits one coherent change when selecting a new page size', async () => {
    const { w, current, pageSize, change } = await setup()
    await userEvent.click(w.get('[data-hn-pagination-size]'))
    await vi.waitFor(() => expect(document.querySelector('[role="option"]')).not.toBeNull())
    const option = [...document.querySelectorAll('[role="option"]')].find(el =>
      el.textContent?.includes('20'),
    )!
    await userEvent.click(option)
    expect(current.value).toBe(1)
    expect(pageSize.value).toBe(20)
    expect(change.mock.calls).toEqual([[{ page: 1, pageSize: 20 }]])
    expect(w.get('[data-hn-pagination-info]').textContent).toContain('1–20')
    expect((w.get('input') as HTMLInputElement).value).toBe('1')
  })

  it('does not take ownership away from controlled values after user changes', async () => {
    const { w, current, pageSize, change } = await setup()
    await userEvent.click(w.get('[data-hn-pagination-action="next"]'))
    expect(change.mock.calls).toEqual([[{ page: 11, pageSize: 10 }]])
    current.value = 4
    pageSize.value = 20
    await tick()
    expect(w.get('[aria-current="page"]').textContent).toBe('4')
    expect(w.get('[data-hn-pagination-info]').textContent).toContain('61–80')
    expect(change).toHaveBeenCalledTimes(1)
  })

  it('waits for pending totals to settle before clamping the controlled page', async () => {
    const { w, current, total, pending, change } = await setup()
    pending.value = true
    total.value = 0
    await tick()
    expect(current.value).toBe(10)
    expect(change).not.toHaveBeenCalled()
    total.value = 250
    pending.value = false
    await tick()
    expect(w.get('[aria-current="page"]').textContent).toBe('10')
    expect(change).not.toHaveBeenCalled()
    total.value = 42
    await tick()
    expect(current.value).toBe(5)
    expect(change.mock.calls).toEqual([[{ page: 5, pageSize: 10 }]])
  })

  it('commits jump input once on Enter and blur, normalizes bounds and cancels invalid input', async () => {
    const { w, current, change } = await setup()
    const input = w.get('input') as HTMLInputElement
    await userEvent.fill(input, '7')
    await userEvent.keyboard('{Enter}')
    await userEvent.tab()
    expect(current.value).toBe(7)
    expect(change.mock.calls).toEqual([[{ page: 7, pageSize: 10 }]])
    await userEvent.fill(input, 'abc')
    await userEvent.keyboard('{Enter}')
    expect(input.value).toBe('7')
    await userEvent.fill(input, '19')
    await userEvent.keyboard('{Escape}')
    expect(input.value).toBe('7')
    await userEvent.fill(input, '999')
    await userEvent.keyboard('{Enter}')
    expect(current.value).toBe(25)
    await userEvent.fill(input, '-2')
    await userEvent.tab()
    expect(current.value).toBe(1)
    expect(change).toHaveBeenCalledTimes(3)
  })

  it('composes controls and custom information through the default slot', async () => {
    const w = await mount(
      <Pagination total={140} defaultValue={3} pageSizeOptions={[10, 20]} align="between">
        <PaginationInfo>
          {state => <span>{'Range ' + state.from + '–' + state.to}</span>}
        </PaginationInfo>
        <PaginationContent />
        <PaginationSize />
        <PaginationJump />
      </Pagination>,
    )
    expect(w.get('[data-hn-pagination-info]').textContent).toBe('Range 21–30')
    expect(w.findAll('nav')).toHaveLength(1)
    expect(w.findAll('[data-type="page"]').length).toBeGreaterThan(0)
    await expectNoA11yViolations(w.element)
  })

  it('keeps the list mounted when single-page navigation is hidden and shields it while pending', async () => {
    const props = signal<Partial<PaginationProps>>({ total: 5, hideSinglePage: true })
    function Harness() {
      return (
        <Pagination
          total={5}
          {...props.use()}
          renderList={() => (
            <button type="button" data-list-item="">
              Item
            </button>
          )}
        />
      )
    }
    const w = await mount(<Harness />)
    const item = w.get('[data-list-item]')
    expect(w.find('nav')).toBeNull()
    props.value = { ...props.value, pending: true }
    await tick()
    expect(item.closest('[inert]')).not.toBeNull()
    expect(w.get('[data-hn-pagination]').getAttribute('aria-busy')).toBe('true')
    props.value = { ...props.value, total: 50, pending: false }
    await tick()
    expect(w.get('[data-list-item]')).toBe(item)
    expect(w.find('nav')).not.toBeNull()
    expect(item.closest('[inert]')).toBeNull()
  })

  it('wraps English page size and jump controls within a narrow container', async () => {
    const screen = await render(
      <UiLocaleProvider messages={enUS}>
        <Pagination
          total={246}
          showInfo
          showJump
          pageSizeOptions={[10, 20, 50]}
          style={{ width: '264px' }}
        />
      </UiLocaleProvider>,
    )
    const nav = screen.container.querySelector('nav')!
    expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth)
    const bounds = nav.getBoundingClientRect()
    expect(
      [...screen.container.querySelectorAll('button,input')].every(control => {
        const box = control.getBoundingClientRect()
        return box.left >= bounds.left && box.right <= bounds.right
      }),
    ).toBe(true)
  })

  it('uses actual item count for the information range and keeps empty ranges valid', async () => {
    const props = signal<Partial<PaginationProps>>({ itemCount: 4 })
    function Harness() {
      return <Pagination total={250} defaultValue={10} showInfo {...props.use()} />
    }
    const w = await mount(<Harness />)
    expect(w.get('[data-hn-pagination-info]').textContent).toContain('91–94')
    props.value = { itemCount: 0 }
    await tick()
    expect(w.get('[data-hn-pagination-info]').textContent).toContain('0–0')
  })
})
