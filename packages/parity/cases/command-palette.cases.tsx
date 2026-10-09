import { h } from 'vue'
import { Settings } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { Settings as LucideSettings } from '@hina-ui/react/../node_modules/lucide-react'
import { lucide } from '@hina-ui/react/lib/icon'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const SettingsIcon = lucide(LucideSettings)

const vueItems = [
  {
    label: '页面',
    items: [
      { id: 'home', label: '首页', keywords: ['home'] },
      {
        id: 'settings',
        label: '设置',
        description: '账号与偏好',
        kbd: ['⌘', ','],
        icon: Settings,
      },
      { id: 'off', label: '停用', disabled: true },
    ],
  },
  { id: 'theme', label: '切换主题' },
]
const reactItems = [
  {
    label: '页面',
    items: [
      { id: 'home', label: '首页', keywords: ['home'] },
      {
        id: 'settings',
        label: '设置',
        description: '账号与偏好',
        kbd: ['⌘', ','],
        icon: SettingsIcon,
      },
      { id: 'off', label: '停用', disabled: true },
    ],
  },
  { id: 'theme', label: '切换主题' },
]
interface Book {
  author: string
}
const books = [
  { id: 'spice', label: '狼与香辛料', data: { author: '支仓冻砂' } },
  { id: 'kino', label: '奇诺之旅的香辛料', data: { author: '时雨泽惠一' } },
]
const many = Array.from({ length: 10000 }, (_, value) => ({
  id: String(value),
  label: `Item ${value}`,
}))

export default defineCases('CommandPalette', [
  {
    name: 'inline with groups, icons and hints',
    vue: () => h(V.CommandPalette, { items: vueItems, inline: true }),
    react: () => <R.CommandPalette items={reactItems} inline />,
  },
  {
    name: 'inline search highlights the matched fragment',
    vue: () => h(V.CommandPalette, { items: vueItems, inline: true, search: '设' }),
    react: () => <R.CommandPalette items={reactItems} inline search="设" />,
  },
  {
    name: 'inline keyword match without a fragment',
    vue: () => h(V.CommandPalette, { items: vueItems, inline: true, search: 'home' }),
    react: () => <R.CommandPalette items={reactItems} inline search="home" />,
  },
  {
    name: 'inline empty state',
    vue: () => h(V.CommandPalette, { items: vueItems, inline: true, search: '不存在' }),
    react: () => <R.CommandPalette items={reactItems} inline search="不存在" />,
  },
  {
    name: 'inline ignore filter',
    vue: () =>
      h(V.CommandPalette, { items: vueItems, inline: true, search: '不存在', ignoreFilter: true }),
    react: () => <R.CommandPalette items={reactItems} inline search="不存在" ignoreFilter />,
  },
  {
    name: 'inline custom label, placeholder and attributes',
    vue: () =>
      h(V.CommandPalette, {
        items: vueItems,
        inline: true,
        label: 'Commands',
        placeholder: 'Type a command',
        class: 'max-w-md',
        'data-testid': 'palette',
      }),
    react: () => (
      <R.CommandPalette
        items={reactItems}
        inline
        label="Commands"
        placeholder="Type a command"
        className="max-w-md"
        data-testid="palette"
      />
    ),
  },
  {
    name: 'dialog trigger',
    vue: () =>
      h(V.CommandPalette, { items: vueItems }, () =>
        h(V.Button, { variant: 'outline', tone: 'neutral' }, () => '搜索'),
      ),
    react: () => (
      <R.CommandPalette items={reactItems}>
        <R.Button variant="outline" tone="neutral">
          搜索
        </R.Button>
      </R.CommandPalette>
    ),
  },
  {
    name: 'open dialog renders nothing on the server',
    vue: () => h('div', [h(V.CommandPalette, { items: vueItems, open: true })]),
    react: () => (
      <div>
        <R.CommandPalette items={reactItems} open />
      </div>
    ),
  },
  {
    name: 'inline virtualized',
    vue: () => h(V.CommandPalette, { items: many, inline: true, virtualize: true }),
    react: () => <R.CommandPalette items={many} inline virtualize />,
  },
  {
    name: 'inline custom item content with data and match',
    vue: () =>
      h(
        V.CommandPalette<Book>,
        { items: books, inline: true, search: '香辛' },
        {
          item: ({ item, match }: V.CommandItemSlotProps<Book>) => [
            h('span', { class: 'truncate' }, [
              item.label.slice(0, match!.start),
              h('mark', item.label.slice(match!.start, match!.end)),
              item.label.slice(match!.end),
            ]),
            h('span', { class: 'text-muted text-xs' }, item.data!.author),
          ],
        },
      ),
    react: () => (
      <R.CommandPalette<Book>
        items={books}
        inline
        search="香辛"
        renderItem={({ item, match }) => (
          <>
            <span className="truncate">
              {item.label.slice(0, match!.start)}
              <mark>{item.label.slice(match!.start, match!.end)}</mark>
              {item.label.slice(match!.end)}
            </span>
            <span className="text-muted text-xs">{item.data!.author}</span>
          </>
        )}
      />
    ),
  },
  {
    name: 'inline custom item without a label match',
    vue: () =>
      h(
        V.CommandPalette<Book>,
        { items: books, inline: true },
        {
          item: ({ item, match }: V.CommandItemSlotProps<Book>) =>
            h('span', { 'data-matched': match ? 'yes' : 'no' }, item.label),
        },
      ),
    react: () => (
      <R.CommandPalette<Book>
        items={books}
        inline
        renderItem={({ item, match }) => (
          <span data-matched={match ? 'yes' : 'no'}>{item.label}</span>
        )}
      />
    ),
  },
  {
    name: 'inline custom input row',
    vue: () =>
      h(
        V.CommandPalette,
        { items: vueItems, inline: true, label: '跳转', placeholder: '搜索页面' },
        {
          input: () =>
            h('div', { class: 'flex items-center gap-2 px-4' }, [
              h('span', '书库'),
              h(V.CommandPaletteInput, { class: 'h-12' }),
            ]),
        },
      ),
    react: () => (
      <R.CommandPalette
        items={reactItems}
        inline
        label="跳转"
        placeholder="搜索页面"
        input={
          <div className="flex items-center gap-2 px-4">
            <span>书库</span>
            <R.CommandPaletteInput className="h-12" />
          </div>
        }
      />
    ),
  },
  {
    name: 'custom input placeholder wins over the palette placeholder',
    vue: () =>
      h(
        V.CommandPalette,
        { items: vueItems, inline: true, placeholder: '搜索页面' },
        { input: () => h(V.CommandPaletteInput, { placeholder: '在书库中搜索' }) },
      ),
    react: () => (
      <R.CommandPalette
        items={reactItems}
        inline
        placeholder="搜索页面"
        input={<R.CommandPaletteInput placeholder="在书库中搜索" />}
      />
    ),
  },
  {
    name: 'inline loading without items',
    vue: () => h(V.CommandPalette, { items: [], inline: true, loading: true }),
    react: () => <R.CommandPalette items={[]} inline loading />,
  },
  {
    name: 'inline loading with items keeps the list and adds a status row',
    vue: () => h(V.CommandPalette, { items: vueItems, inline: true, loading: true }),
    react: () => <R.CommandPalette items={reactItems} inline loading />,
  },
  {
    name: 'inline custom loading content',
    vue: () =>
      h(
        V.CommandPalette,
        { items: [], inline: true, ignoreFilter: true, loading: true },
        { loading: () => '搜索中' },
      ),
    react: () => (
      <R.CommandPalette items={[]} inline ignoreFilter loading loadingContent="搜索中" />
    ),
  },
  {
    name: 'inline custom empty content with the search text',
    vue: () =>
      h(
        V.CommandPalette,
        { items: [], inline: true, ignoreFilter: true, search: '香辛' },
        { empty: ({ search }: V.CommandEmptySlotProps) => `没有找到「${search}」` },
      ),
    react: () => (
      <R.CommandPalette
        items={[]}
        inline
        ignoreFilter
        search="香辛"
        renderEmpty={({ search }) => `没有找到「${search}」`}
      />
    ),
  },
  {
    name: 'inline virtualized loading without items',
    vue: () => h(V.CommandPalette, { items: [], inline: true, virtualize: true, loading: true }),
    react: () => <R.CommandPalette items={[]} inline virtualize loading />,
  },
])
