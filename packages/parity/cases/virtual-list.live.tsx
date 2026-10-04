import { h, type VNode } from 'vue'
import type { ReactElement } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VVirtualList from '@hina-ui/vue/components/virtual-list/VirtualList.vue'
import { VirtualList } from '@hina-ui/react/components/virtual-list/VirtualList'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

type Item = { id: number; label: string }
const items: Item[] = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id}` }))
const getKey = (item: Item) => item.id

async function ready() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('no viewport')
  })
  await frames(6)
}

const viewport = () => document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')!

function vueList(
  props: Record<string, unknown>,
  slot?: (props: { item: Item; index: number }) => VNode | string,
) {
  return () =>
    h(
      VVirtualList<Item>,
      { items, getKey, label: 'Items', style: { width: '400px' }, ...props },
      { default: slot ?? (({ item }: { item: Item }) => h('span', item.label)) },
    )
}

function reactList(
  props: Record<string, unknown>,
  slot?: (props: { item: Item; index: number }) => ReactElement | string,
) {
  return () => (
    <VirtualList<Item>
      items={items}
      getKey={getKey}
      label="Items"
      style={{ width: '400px' }}
      {...props}
    >
      {slot ?? (({ item }) => <span>{item.label}</span>)}
    </VirtualList>
  )
}

const cases: LiveCase[] = [
  {
    name: 'fixed rows after mount',
    vue: vueList({ estimateSize: 40, dynamic: false, height: 200 }),
    react: reactList({ estimateSize: 40, dynamic: false, height: 200 }),
    settle: ready,
  },
  {
    name: 'dynamic rows with gaps and padding after measurement',
    vue: vueList({ gap: 8, paddingStart: 12, paddingEnd: 16, height: 240 }, ({ index }) =>
      h('div', { style: { height: `${40 + (index % 3) * 10}px` } }, `Row ${index}`),
    ),
    react: reactList({ gap: 8, paddingStart: 12, paddingEnd: 16, height: 240 }, ({ index }) => (
      <div style={{ height: `${40 + (index % 3) * 10}px` }}>{`Row ${index}`}</div>
    )),
    settle: ready,
  },
  {
    name: 'fixed rows after scrolling',
    vue: vueList({ estimateSize: 40, dynamic: false, height: 200 }),
    react: reactList({ estimateSize: 40, dynamic: false, height: 200 }),
    interact: async () => {
      await ready()
      viewport().scrollTop = 20000
      await frames(4)
      await new Promise(resolve => setTimeout(resolve, 300))
    },
    settle: ready,
  },
  {
    name: 'keyboard paging from the named viewport',
    vue: vueList({ estimateSize: 40, dynamic: false, height: 200 }),
    react: reactList({ estimateSize: 40, dynamic: false, height: 200 }),
    interact: async () => {
      await ready()
      viewport().focus()
      await userEvent.keyboard('{PageDown}{PageDown}')
      await new Promise(resolve => setTimeout(resolve, 300))
    },
    settle: ready,
  },
  ...(['ltr', 'rtl'] as const).map(dir => ({
    name: `horizontal ${dir} after mount`,
    vue: vueList(
      { orientation: 'horizontal', dir, estimateSize: 100, gap: 8, height: 120 },
      ({ item }) => h('div', { style: { width: '100px' } }, item.label),
    ),
    react: reactList(
      { orientation: 'horizontal', dir, estimateSize: 100, gap: 8, height: 120 },
      ({ item }) => <div style={{ width: '100px' }}>{item.label}</div>,
    ),
    settle: ready,
  })),
  {
    name: 'loading over existing rows',
    vue: vueList({ items: items.slice(0, 20), loading: true, estimateSize: 40, dynamic: false }),
    react: reactList({
      items: items.slice(0, 20),
      loading: true,
      estimateSize: 40,
      dynamic: false,
    }),
    settle: async () => {
      await ready()
      await vi.waitFor(() => {
        const overlay = document.querySelector<HTMLElement>('[data-hn-loading-overlay]')
        if (!overlay || overlay.getAnimations().length) throw new Error('overlay not settled')
      })
      await frames(2)
    },
  },
  {
    name: 'empty list',
    vue: vueList({ items: [], emptyText: 'Nothing here' }),
    react: reactList({ items: [], emptyText: 'Nothing here' }),
    settle: ready,
  },
]

export default defineLiveCases('VirtualList', cases)
