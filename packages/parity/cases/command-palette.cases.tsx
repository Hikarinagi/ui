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
])
