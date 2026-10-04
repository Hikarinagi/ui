import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

type Item = { id: number; label: string }
const items: Item[] = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id}` }))
const getKey = (item: Item) => item.id

export default defineCases('VirtualList', [
  {
    name: 'fixed rows with a bounded initial range',
    vue: () =>
      h(
        V.VirtualList<Item>,
        { items, getKey, estimateSize: 40, dynamic: false, height: 200, label: 'Items' },
        { default: ({ item }: { item: Item }) => item.label },
      ),
    react: () => (
      <R.VirtualList
        items={items}
        getKey={getKey}
        estimateSize={40}
        dynamic={false}
        height={200}
        label="Items"
      >
        {({ item }) => item.label}
      </R.VirtualList>
    ),
  },
  {
    name: 'dynamic rows with gaps, padding and item classes',
    vue: () =>
      h(
        V.VirtualList<Item>,
        {
          items: items.slice(0, 50),
          getKey,
          gap: 8,
          paddingStart: 12,
          paddingEnd: 16,
          itemClass: (_item: Item, index: number) => (index % 2 ? 'odd' : undefined),
          class: 'border',
          style: { width: '400px' },
        },
        { default: ({ item, index }: { item: Item; index: number }) => `${index}: ${item.label}` },
      ),
    react: () => (
      <R.VirtualList
        items={items.slice(0, 50)}
        getKey={getKey}
        gap={8}
        paddingStart={12}
        paddingEnd={16}
        itemClass={(_item, index) => (index % 2 ? 'odd' : undefined)}
        className="border"
        style={{ width: '400px' }}
      >
        {({ item, index }) => `${index}: ${item.label}`}
      </R.VirtualList>
    ),
  },
  {
    name: 'horizontal rtl with initial offset',
    vue: () =>
      h(
        V.VirtualList<Item>,
        {
          items,
          getKey,
          estimateSize: 80,
          dynamic: false,
          initialOffset: 800,
          initialRect: { width: 240, height: 100 },
          orientation: 'horizontal',
          dir: 'rtl',
          overscan: 0,
          height: '6rem',
        },
        { default: ({ item }: { item: Item }) => item.label },
      ),
    react: () => (
      <R.VirtualList
        items={items}
        getKey={getKey}
        estimateSize={80}
        dynamic={false}
        initialOffset={800}
        initialRect={{ width: 240, height: 100 }}
        orientation="horizontal"
        dir="rtl"
        overscan={0}
        height="6rem"
      >
        {({ item }) => item.label}
      </R.VirtualList>
    ),
  },
  {
    name: 'empty with default text',
    vue: () => h(V.VirtualList<number>, { items: [], getKey: (item: number) => item }),
    react: () => <R.VirtualList<number> items={[]} getKey={item => item} />,
  },
  {
    name: 'empty with custom content and no shadow',
    vue: () =>
      h(
        V.VirtualList<number>,
        { items: [], getKey: (item: number) => item, emptyText: 'Nothing', shadow: false },
        { empty: () => h('strong', 'Empty list') },
      ),
    react: () => (
      <R.VirtualList<number>
        items={[]}
        getKey={item => item}
        emptyText="Nothing"
        shadow={false}
        empty={<strong>Empty list</strong>}
      />
    ),
  },
  {
    name: 'loading with custom content',
    vue: () =>
      h(
        V.VirtualList<number>,
        { items: [], getKey: (item: number) => item, loading: true },
        { loading: () => 'Fetching items' },
      ),
    react: () => (
      <R.VirtualList<number>
        items={[]}
        getKey={item => item}
        loading
        loadingContent="Fetching items"
      />
    ),
  },
  {
    name: 'loading with existing items',
    vue: () =>
      h(
        V.VirtualList<Item>,
        { items: items.slice(0, 3), getKey, loading: true },
        { default: ({ item }: { item: Item }) => item.label },
      ),
    react: () => (
      <R.VirtualList items={items.slice(0, 3)} getKey={getKey} loading>
        {({ item }) => item.label}
      </R.VirtualList>
    ),
  },
])
