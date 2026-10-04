import { defineComponent, h, ref } from 'vue'
import { useState } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VPagination from '@hina-ui/vue/components/pagination/Pagination.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import { Pagination, type PaginationProps } from '@hina-ui/react/components/pagination/Pagination'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'
const popup = () => document.querySelector<HTMLElement>('[data-hn-pagination-popup]')
const trigger = (container: HTMLElement, side = 'prev') =>
  container.querySelector<HTMLElement>(`[data-hn-pagination-ellipsis][data-side="${side}"]`)!

async function park() {
  const element = document.createElement('div')
  element.style.cssText = 'position:fixed;left:0;top:0;width:4px;height:4px'
  document.body.append(element)
  await userEvent.hover(element)
  element.remove()
}

async function finished(element: Element | null) {
  if (element)
    await Promise.allSettled(element.getAnimations().map(animation => animation.finished))
}

async function opened() {
  await vi.waitFor(() => {
    if (popup()?.dataset.state !== 'open') throw new Error('popup closed')
    const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
    if (!popup()!.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('no viewport')
  })
  await finished(popup())
  await frames(6)
}

async function closed() {
  await vi.waitFor(() => {
    if (popup()) throw new Error('popup present')
  })
  await frames(6)
}

async function mounted() {
  await frames(6)
}

async function tooltip() {
  await vi.waitFor(() => {
    if (!document.querySelector('[role="tooltip"]')) throw new Error('no tooltip')
    const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  const bubble = document.querySelector('[data-side].hn-anim-pop')
  await finished(bubble)
  await frames(6)
}

const style = 'padding:80px 40px;width:720px'
const reactStyle = { padding: '80px 40px', width: 720 }

type Options = Partial<
  Pick<PaginationProps, 'total' | 'showFirstLast' | 'showInfo' | 'showJump' | 'pageSizeOptions'>
> & { page?: number }

function uncontrolled(name: string, props: Options, extra: Partial<LiveCase>) {
  const { page, ...rest } = props
  return {
    name,
    vue: () =>
      h('div', { style }, [
        h(VPagination, {
          total: 250,
          ...rest,
          ...(page !== undefined ? { modelValue: page } : {}),
        }),
      ]),
    react: () => (
      <div style={reactStyle}>
        <Pagination total={250} {...rest} defaultValue={page} />
      </div>
    ),
    settle: mounted,
    ...extra,
  } as LiveCase
}

const VPending = defineComponent({
  setup() {
    const pending = ref(false)
    return () =>
      h('div', { style }, [
        h(
          'button',
          { type: 'button', id: 'pending', onClick: () => (pending.value = !pending.value) },
          'pending',
        ),
        h(VPagination, { total: 250, modelValue: 10, pending: pending.value }),
      ])
  },
})

function Pending() {
  const [pending, setPending] = useState(false)
  return (
    <div style={reactStyle}>
      <button type="button" id="pending" onClick={() => setPending(value => !value)}>
        pending
      </button>
      <Pagination total={250} defaultValue={10} pending={pending} />
    </div>
  )
}

const cases: LiveCase[] = [
  uncontrolled('after mount', { page: 10 }, {}),
  {
    name: 'inherits rtl from an ancestor after mount',
    vue: () => h('div', { dir: 'rtl', style }, [h(VPagination, { total: 40 })]),
    react: () => (
      <div dir="rtl" style={reactStyle}>
        <Pagination total={40} />
      </div>
    ),
    settle: mounted,
  },
  uncontrolled(
    'next control advances an uncontrolled page',
    { showFirstLast: true },
    {
      interact: async container => {
        await userEvent.click(
          container.querySelector<HTMLElement>('[data-hn-pagination-action="next"]')!,
        )
      },
    },
  ),
  uncontrolled(
    'hover opens the previous pages popup',
    { page: 10 },
    {
      interact: async container => {
        await park()
        await userEvent.hover(trigger(container))
      },
      settle: opened,
    },
  ),
  uncontrolled(
    'hover opens the next pages popup on a large range',
    { total: 10000, page: 500 },
    {
      interact: async container => {
        await park()
        await userEvent.hover(trigger(container, 'next'))
      },
      settle: opened,
    },
  ),
  uncontrolled(
    'keyboard opens the list on the first hidden page',
    { page: 10 },
    {
      interact: async container => {
        await park()
        trigger(container).focus()
        await userEvent.keyboard('{ArrowDown}')
        await vi.waitFor(() => {
          if (document.activeElement?.getAttribute('data-hn-pagination-choice') !== '2')
            throw new Error('not focused')
        })
      },
      settle: opened,
    },
  ),
  uncontrolled(
    'keyboard End reaches the last hidden page of a large range',
    { total: 100000, page: 5000 },
    {
      interact: async container => {
        await park()
        trigger(container).focus()
        await userEvent.keyboard('{ArrowUp}')
        await vi.waitFor(() => {
          if (document.activeElement?.getAttribute('data-hn-pagination-choice') !== '4998')
            throw new Error('not focused')
        })
        await userEvent.keyboard('{Home}{ArrowDown}{ArrowDown}')
        await vi.waitFor(() => {
          if (document.activeElement?.getAttribute('data-hn-pagination-choice') !== '4')
            throw new Error('not focused')
        })
      },
      settle: opened,
    },
  ),
  uncontrolled(
    'escape closes the list and restores focus',
    { page: 10 },
    {
      interact: async container => {
        await park()
        trigger(container).focus()
        await userEvent.keyboard('{ArrowDown}')
        await opened()
        await userEvent.keyboard('{Escape}')
      },
      settle: closed,
    },
  ),
  uncontrolled(
    'choosing a hidden page closes the popup',
    { page: 10 },
    {
      interact: async container => {
        await park()
        await userEvent.hover(trigger(container))
        await opened()
        await userEvent.click(
          document.querySelector<HTMLElement>('[data-hn-pagination-choice="3"]')!,
        )
      },
      settle: closed,
    },
  ),
  uncontrolled(
    'clicking an ellipsis skips a group',
    { page: 10 },
    {
      interact: async container => {
        await park()
        trigger(container, 'next').focus()
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard('{Escape}')
      },
      settle: closed,
    },
  ),
  uncontrolled(
    'touch opens the popup without skipping',
    { page: 10 },
    {
      interact: async container => {
        await park()
        const source = trigger(container)
        source.dispatchEvent(
          new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }),
        )
        source.click()
      },
      settle: opened,
    },
  ),
  {
    name: 'pending blocks the open popup',
    vue: () => h(VPending),
    react: () => <Pending />,
    interact: async container => {
      await park()
      await userEvent.hover(trigger(container))
      await opened()
      container.querySelector<HTMLElement>('#pending')!.click()
    },
    settle: closed,
  },
  uncontrolled(
    'page size select opens its options',
    { pageSizeOptions: [10, 20, 50], showInfo: true, showJump: true },
    {
      interact: async container => {
        await userEvent.click(container.querySelector<HTMLElement>('[data-hn-pagination-size]')!)
        await vi.waitFor(() => {
          if (!document.querySelector('[role="option"]')) throw new Error('no options')
        })
      },
      settle: async () => {
        await vi.waitFor(() => {
          const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
          if (!wrapper || wrapper.style.transform.includes('-200%'))
            throw new Error('not positioned')
        })
        await finished(document.querySelector('[data-hn-select-content]'))
        await frames(6)
      },
    },
  ),
  uncontrolled(
    'choosing a page size resets the page',
    { page: 10, pageSizeOptions: [10, 20, 50], showInfo: true, showJump: true },
    {
      interact: async container => {
        await userEvent.click(container.querySelector<HTMLElement>('[data-hn-pagination-size]')!)
        await vi.waitFor(() => {
          if (!document.querySelector('[role="option"]')) throw new Error('no options')
        })
        const option = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(
          element => element.textContent?.includes('20'),
        )!
        await userEvent.click(option)
        await vi.waitFor(() => {
          if (document.querySelector('[role="option"]')) throw new Error('still open')
        })
      },
    },
  ),
  uncontrolled(
    'jump commits on Enter',
    { showJump: true, showInfo: true },
    {
      interact: async container => {
        const input = container.querySelector<HTMLInputElement>('input')!
        await userEvent.fill(input, '999')
        await userEvent.keyboard('{Enter}')
      },
    },
  ),
  {
    name: 'truncated page label shows a tooltip on hover',
    vue: () =>
      h(VTooltipProvider, { delayDuration: 0 }, () =>
        h('div', { style }, [h(VPagination, { total: 2000000, modelValue: 100000, size: 'sm' })]),
      ),
    react: () => (
      <TooltipProvider delayDuration={0}>
        <div style={reactStyle}>
          <Pagination total={2000000} defaultValue={100000} size="sm" />
        </div>
      </TooltipProvider>
    ),
    interact: async container => {
      await park()
      await frames(4)
      await userEvent.hover(container.querySelector<HTMLElement>('[aria-current="page"]')!, {
        position: { x: 2, y: 2 },
      })
    },
    settle: tooltip,
  },
  {
    name: 'fitting page labels mark grace triggers without a tooltip',
    vue: () =>
      h(VTooltipProvider, { delayDuration: 0 }, () =>
        h('div', { style }, [h(VPagination, { total: 50, modelValue: 2 })]),
      ),
    react: () => (
      <TooltipProvider delayDuration={0}>
        <div style={reactStyle}>
          <Pagination total={50} defaultValue={2} />
        </div>
      </TooltipProvider>
    ),
    interact: async container => {
      await park()
      await userEvent.hover(container.querySelector<HTMLElement>('[aria-current="page"]')!)
      await new Promise(resolve => setTimeout(resolve, 120))
    },
    settle: mounted,
  },
]

export default defineLiveCases('Pagination', cases)
