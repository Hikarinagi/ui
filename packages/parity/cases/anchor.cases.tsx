import { h } from 'vue'
import VAnchor from '@hina-ui/vue/components/anchor/Anchor.vue'
import VScrollArea from '@hina-ui/vue/components/scroll-area/ScrollArea.vue'
import VSection from '@hina-ui/vue/components/section/Section.vue'
import VHeading from '@hina-ui/vue/components/heading/Heading.vue'
import VInline from '@hina-ui/vue/components/inline/Inline.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import VTag from '@hina-ui/vue/components/tag/Tag.vue'
import { Anchor } from '@hina-ui/react/components/anchor/Anchor'
import { ScrollArea } from '@hina-ui/react/components/scroll-area/ScrollArea'
import { Section } from '@hina-ui/react/components/section/Section'
import { Heading } from '@hina-ui/react/components/heading/Heading'
import { Inline } from '@hina-ui/react/components/inline/Inline'
import { Text } from '@hina-ui/react/components/text/Text'
import { Tag } from '@hina-ui/react/components/tag/Tag'
import { defineCases } from '../src/cases'

interface Item {
  id: string
  label: string
  modified?: boolean
  children?: Item[]
}

const items: Item[] = [
  { id: 'a', label: '变体' },
  { id: 'b', label: '尺寸', children: [{ id: 'b1', label: '密度' }] },
]

const nested: Item[] = [
  { id: 'nest-intro', label: '简介' },
  {
    id: 'nest-route',
    label: '路线',
    children: [
      { id: 'nest-route-a', label: '共通线' },
      { id: 'nest-route-b', label: '个人线' },
    ],
  },
  { id: 'nest-staff', label: '制作人员' },
]

function demo(
  name: string,
  list: Item[],
  props: { label?: string; className: string },
  body: string,
) {
  const flat = list.flatMap(item => [item, ...(item.children ?? [])])
  return {
    name,
    vue: () =>
      h(VInline, { gap: 'lg', align: 'start', class: 'w-full max-w-2xl' }, () => [
        h(VScrollArea, { class: 'border-line h-56 flex-1 rounded-lg border' }, () =>
          flat.map(item =>
            h(VSection, { id: item.id, key: item.id, class: 'min-h-40 p-4' }, () => [
              h(VHeading, { level: 3, size: 'sm' }, () => item.label),
              h(VText, { size: 'sm', tone: 'muted' }, () => body),
            ]),
          ),
        ),
        h(VAnchor, { items: list, label: props.label, class: props.className }),
      ]),
    react: () => (
      <Inline gap="lg" align="start" className="w-full max-w-2xl">
        <ScrollArea className="border-line h-56 flex-1 rounded-lg border">
          {flat.map(item => (
            <Section id={item.id} key={item.id} className="min-h-40 p-4">
              <Heading level={3} size="sm">
                {item.label}
              </Heading>
              <Text size="sm" tone="muted">
                {body}
              </Text>
            </Section>
          ))}
        </ScrollArea>
        <Anchor items={list} label={props.label} className={props.className} />
      </Inline>
    ),
  }
}

const trailingItems: Item[] = [
  { id: 'trailing-a', label: '条目 A', modified: true },
  {
    id: 'trailing-b',
    label: '条目 B',
    modified: false,
    children: [{ id: 'trailing-c', label: '子条目', modified: true }],
  },
]

export default defineCases('Anchor', [
  {
    name: 'server render guesses no active item and draws no highlight',
    vue: () => h(VAnchor, { items }),
    react: () => <Anchor items={items} />,
  },
  {
    name: 'label overrides the locale landmark name',
    vue: () => h(VAnchor, { items, label: '版本目录' }),
    react: () => <Anchor items={items} label="版本目录" />,
  },
  {
    name: 'nested entries indent one level',
    vue: () => h(VAnchor, { items: nested, class: 'w-32 shrink-0' }),
    react: () => <Anchor items={nested} className="w-32 shrink-0" />,
  },
  {
    name: 'empty items',
    vue: () => h(VAnchor, { items: [] }),
    react: () => <Anchor items={[]} />,
  },
  {
    name: 'attributes reach the nav landmark',
    vue: () =>
      h(VAnchor, {
        items,
        id: 'toc',
        'data-x': '1',
        'aria-label': '自定义',
        style: 'height: 320px',
      }),
    react: () => (
      <Anchor items={items} id="toc" data-x="1" aria-label="自定义" style={{ height: '320px' }} />
    ),
  },
  {
    name: 'trailing slot receives the original items',
    vue: () =>
      h(
        VAnchor,
        { items: trailingItems, label: '带尾部标记的目录', class: 'w-44 shrink-0' },
        {
          trailing: ({ item, active }: { item: Item; active: boolean }) =>
            item.modified ? h(VTag, { tone: active ? 'accent' : 'neutral' }, () => '已修改') : null,
        },
      ),
    react: () => (
      <Anchor
        items={trailingItems}
        label="带尾部标记的目录"
        className="w-44 shrink-0"
        renderTrailing={({ item, active }) =>
          item.modified ? <Tag tone={active ? 'accent' : 'neutral'}>已修改</Tag> : null
        }
      />
    ),
  },
  demo(
    'demo basic',
    [
      { id: 'basic-a', label: '作品简介' },
      { id: 'basic-b', label: '登场角色' },
      { id: 'basic-c', label: '制作人员' },
    ],
    { className: 'w-28 shrink-0' },
    '这一节的正文。',
  ),
  demo(
    'demo label',
    [
      { id: 'label-a', label: '版本 1.2' },
      { id: 'label-b', label: '版本 1.1' },
      { id: 'label-c', label: '版本 1.0' },
    ],
    { label: '版本目录', className: 'w-28 shrink-0' },
    '这一版的更新内容。',
  ),
  demo('demo nested', nested, { className: 'w-32 shrink-0' }, '这一节的正文。'),
  demo(
    'demo long directory',
    Array.from({ length: 51 }, (_, index) => ({
      id: `long-toc-${index + 1}`,
      label: `第 ${index + 1} 节`,
    })),
    { label: '长篇文章目录', className: 'w-44' },
    '滚动正文阅读后续小节。',
  ),
])
