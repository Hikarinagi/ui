import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VDataList from '@hina-ui/vue/components/data-list/DataList.vue'
import { DataList } from '@hina-ui/react/components/data-list/DataList'
import type { DataListProps } from '@hina-ui/react/components/data-list/types'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const items = Array.from({ length: 1000 }, (_, id) => ({ id, label: `Item ${id}` }))
type Item = (typeof items)[number]
type Props = Partial<DataListProps<Item>>

async function animations() {
  await vi.waitFor(async () => {
    const running = document.getAnimations().filter(animation => {
      const target = (animation.effect as KeyframeEffect | null)?.target
      return (
        animation.playState === 'running' &&
        animation.effect?.getTiming().iterations !== Infinity &&
        !(target instanceof Element && target.closest('.os-scrollbar'))
      )
    })
    if (running.length) throw new Error('animating')
  })
}

async function settled() {
  await frames(8)
  await animations()
  await frames(4)
}

async function bounded() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('no viewport')
  })
  await settled()
}

function both(name: string, props: Props, extra: Partial<LiveCase> = {}): LiveCase {
  const { className, page, layout, ...rest } = props
  return {
    name,
    vue: () =>
      h(VDataList<Item>, {
        items,
        itemKey: 'id',
        itemTitle: 'label',
        label: 'Items',
        style: { width: '600px' },
        ...(rest as Record<string, unknown>),
        ...(page !== undefined ? { page } : {}),
        ...(layout !== undefined ? { layout } : {}),
        ...(className ? { class: className } : {}),
      }),
    react: () => (
      <DataList<Item>
        items={items}
        itemKey="id"
        itemTitle="label"
        label="Items"
        style={{ width: '600px' }}
        {...rest}
        defaultPage={page}
        defaultLayout={layout}
        className={className}
      />
    ),
    settle: settled,
    ...extra,
  }
}

const viewport = () => document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')!

export default defineLiveCases('DataList', [
  both('plain list after mount', { items: items.slice(0, 5) }),
  both(
    'virtual list after mount',
    { virtualize: { estimateSize: 64 }, height: 240 },
    { settle: bounded },
  ),
  both(
    'virtual list scrolled',
    { virtualize: { estimateSize: 64 }, height: 240 },
    {
      interact: async () => {
        await bounded()
        viewport().scrollTop = 3000
        await vi.waitFor(() => {
          if (!document.querySelector('[data-index="50"]')) throw new Error('not scrolled')
        })
      },
      settle: bounded,
    },
  ),
  both(
    'virtual grid after mount',
    {
      layout: 'grid',
      gridMin: '160px',
      gridGap: 'sm',
      contentClass: 'p-4',
      virtualize: { estimateSize: 96, overscan: 1, initialColumns: 2 },
      height: 240,
      itemClass: 'h-24',
    },
    { settle: bounded },
  ),
  both('bounded nonvirtual list', { items: items.slice(0, 12), height: 200 }, { settle: bounded }),
  both(
    'layout toggle switches to grid',
    { items: items.slice(0, 4), layoutToggle: true, gridMin: '10rem' },
    {
      interact: async container => {
        await userEvent.click(container.querySelector<HTMLElement>('[aria-label="网格视图"]')!)
      },
    },
  ),
  both(
    'local pagination advances',
    { items: items.slice(0, 23), pagination: true, pageSize: 5 },
    {
      interact: async container => {
        await userEvent.click(
          container.querySelector<HTMLElement>('[data-hn-pagination-action="next"]')!,
        )
      },
    },
  ),
  both(
    'unknown total advances with the compact pager',
    { items: items.slice(0, 5), pagination: true, manual: true, hasNextPage: true },
    {
      interact: async container => {
        await userEvent.click(container.querySelector<HTMLElement>('nav button:last-child')!)
      },
    },
  ),
  both(
    'refreshing shows the overlay',
    { items: items.slice(0, 3), loading: true },
    {
      settle: async () => {
        await new Promise(resolve => setTimeout(resolve, 450))
        await settled()
      },
    },
  ),
  both('initial loading placeholders', { items: [], loading: true, placeholderCount: 2 }),
  both('empty state', { items: [] }),
])
