import { h } from 'vue'
import VMasonry from '@hina-ui/vue/components/masonry/Masonry.vue'
import { Masonry } from '@hina-ui/react/components/masonry/Masonry'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import { provideUiLocale, enUS as vueEnUS } from '@hina-ui/vue/locale'
import { defineComponent } from 'vue'
import { defineCases } from '../src/cases'

type Card = { id: number; title: string }
const cards: Card[] = [
  { id: 3, title: 'Third' },
  { id: 1, title: 'First' },
  { id: 2, title: 'Second' },
]
const getKey = (card: Card) => card.id
const vueKey = (card: unknown) => (card as Card).id
const gaps = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const

export default defineCases('Masonry', [
  {
    name: 'items in data order with a label',
    vue: () =>
      h(
        VMasonry,
        { items: cards, getKey: vueKey, label: 'Gallery', minColumnWidth: 180 },
        { default: ({ item }: { item: Card }) => h('button', item.title) },
      ),
    react: () => (
      <Masonry items={cards} getKey={getKey} label="Gallery" minColumnWidth={180}>
        {({ item }) => <button>{item.title}</button>}
      </Masonry>
    ),
  },
  ...gaps.map(gap => ({
    name: `gap ${gap} with fixed columns`,
    vue: () =>
      h(
        VMasonry,
        { items: cards, getKey: vueKey, gap, columns: 2.7 },
        { default: ({ item, index }: { item: Card; index: number }) => `${index}:${item.title}` },
      ),
    react: () => (
      <Masonry items={cards} getKey={getKey} gap={gap} columns={2.7}>
        {({ item, index }) => `${index}:${item.title}`}
      </Masonry>
    ),
  })),
  {
    name: 'invalid sizes fall back',
    vue: () =>
      h(
        VMasonry,
        { items: cards, getKey: vueKey, minColumnWidth: -4, columns: Number.NaN },
        { default: ({ item }: { item: Card }) => item.title },
      ),
    react: () => (
      <Masonry items={cards} getKey={getKey} minColumnWidth={-4} columns={Number.NaN}>
        {({ item }) => item.title}
      </Masonry>
    ),
  },
  {
    name: 'item classes, direction, root class and attributes',
    vue: () =>
      h(
        VMasonry,
        {
          items: cards,
          getKey: vueKey,
          dir: 'rtl',
          sequential: true,
          class: 'max-w-xl',
          id: 'wall',
          style: { width: '600px' },
          itemClass: (item: unknown, index: number) =>
            index ? `card-${(item as Card).id}` : undefined,
        },
        { default: ({ item }: { item: Card }) => item.title },
      ),
    react: () => (
      <Masonry
        items={cards}
        getKey={getKey}
        dir="rtl"
        sequential
        className="max-w-xl"
        id="wall"
        style={{ width: '600px' }}
        itemClass={(item, index) => (index ? `card-${item.id}` : undefined)}
      >
        {({ item }) => item.title}
      </Masonry>
    ),
  },
  {
    name: 'string item class',
    vue: () =>
      h(
        VMasonry,
        { items: cards, getKey: vueKey, itemClass: 'p-2' },
        { default: ({ item }: { item: Card }) => item.title },
      ),
    react: () => (
      <Masonry items={cards} getKey={getKey} itemClass="p-2">
        {({ item }) => item.title}
      </Masonry>
    ),
  },
  {
    name: 'default empty text',
    vue: () => h(VMasonry, { items: [], getKey: () => '' }),
    react: () => <Masonry<unknown> items={[]} getKey={() => ''} />,
  },
  {
    name: 'empty text prop',
    vue: () => h(VMasonry, { items: [], getKey: () => '', emptyText: 'Nothing saved' }),
    react: () => <Masonry<unknown> items={[]} getKey={() => ''} emptyText="Nothing saved" />,
  },
  {
    name: 'custom empty slot wins over empty text',
    vue: () =>
      h(
        VMasonry,
        { items: [], getKey: () => '', emptyText: 'Nothing saved' },
        { empty: () => h('strong', 'Custom empty') },
      ),
    react: () => (
      <Masonry<unknown>
        items={[]}
        getKey={() => ''}
        emptyText="Nothing saved"
        empty={<strong>Custom empty</strong>}
      />
    ),
  },
  {
    name: 'loading with existing items',
    vue: () =>
      h(
        VMasonry,
        { items: cards, getKey: vueKey, loading: true, columns: 2 },
        { default: ({ item }: { item: Card }) => item.title },
      ),
    react: () => (
      <Masonry items={cards} getKey={getKey} loading columns={2}>
        {({ item }) => item.title}
      </Masonry>
    ),
  },
  {
    name: 'loading without items',
    vue: () => h(VMasonry, { items: [], getKey: () => '', loading: true }),
    react: () => <Masonry<unknown> items={[]} getKey={() => ''} loading />,
  },
  {
    name: 'custom loading slot',
    vue: () =>
      h(
        VMasonry,
        { items: cards, getKey: vueKey, loading: true },
        {
          default: ({ item }: { item: Card }) => item.title,
          loading: () => 'Appending cards',
        },
      ),
    react: () => (
      <Masonry items={cards} getKey={getKey} loading loadingContent="Appending cards">
        {({ item }) => item.title}
      </Masonry>
    ),
  },
  {
    name: 'pending placeholder hides the measurable list',
    vue: () =>
      h(
        VMasonry,
        { items: cards, getKey: vueKey, label: 'Photos' },
        {
          default: ({ item }: { item: Card }) => h('button', item.title),
          pending: () => h('div', 'Photo placeholders'),
        },
      ),
    react: () => (
      <Masonry items={cards} getKey={getKey} label="Photos" pending={<div>Photo placeholders</div>}>
        {({ item }) => <button>{item.title}</button>}
      </Masonry>
    ),
  },
  {
    name: 'pending for an initial request',
    vue: () =>
      h(
        VMasonry,
        { items: [], getKey: () => '', loading: true },
        {
          pending: () => 'Preparing cards',
          loading: () => 'Appending cards',
          empty: () => 'No cards',
        },
      ),
    react: () => (
      <Masonry<unknown>
        items={[]}
        getKey={() => ''}
        loading
        pending="Preparing cards"
        loadingContent="Appending cards"
        empty="No cards"
      />
    ),
  },
  {
    name: 'idle empty list with a pending slot shows its empty state',
    vue: () =>
      h(
        VMasonry,
        { items: [], getKey: () => '' },
        { pending: () => 'Preparing cards', empty: () => 'No cards' },
      ),
    react: () => (
      <Masonry<unknown> items={[]} getKey={() => ''} pending="Preparing cards" empty="No cards" />
    ),
  },
  {
    name: 'English locale',
    vue: () =>
      h(
        defineComponent({
          setup() {
            provideUiLocale(vueEnUS)
            return () => h(VMasonry, { items: [], getKey: () => '', loading: true })
          },
        }),
      ),
    react: () => (
      <UiLocaleProvider messages={enUS}>
        <Masonry<unknown> items={[]} getKey={() => ''} loading />
      </UiLocaleProvider>
    ),
  },
])
