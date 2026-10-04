import { h } from 'vue'
import VTimeline from '@hina-ui/vue/components/timeline/Timeline.vue'
import { Timeline } from '@hina-ui/react/components/timeline/Timeline'
import type { TimelineItem, TimelineSlotProps } from '@hina-ui/react/components/timeline/types'
import { defineCases } from '../src/cases'

const items: TimelineItem[] = [
  {
    id: 'a',
    title: 'First',
    description: 'First description',
    time: '09:00',
    dateTime: '2026-09-16T09:00:00Z',
  },
  { id: 'b', title: 'Second', time: 'Yesterday', tone: 'success' },
  { id: 'c', title: 'Third' },
]

interface Custom extends TimelineItem {
  author: string
}
const custom: Custom[] = [
  { id: 'a', title: 'Default', author: 'Hina', time: 'Hidden time' },
  { title: 'No id', author: 'Kai', description: 'Body' },
]
const scope = ({ item, index }: TimelineSlotProps<Custom>) => `${item.author}:${index}`

export default defineCases('Timeline', [
  {
    name: 'default vertical list',
    vue: () => h(VTimeline, { items }),
    react: () => <Timeline items={items} />,
  },
  {
    name: 'empty list',
    vue: () => h(VTimeline, { items: [] }),
    react: () => <Timeline items={[]} />,
  },
  {
    name: 'singleton without connector',
    vue: () => h(VTimeline, { items: items.slice(0, 1) }),
    react: () => <Timeline items={items.slice(0, 1)} />,
  },
  {
    name: 'reversed order',
    vue: () => h(VTimeline, { items, reverse: true }),
    react: () => <Timeline items={items} reverse />,
  },
  {
    name: 'time in the opposite region',
    vue: () => h(VTimeline, { items, timePosition: 'opposite' }),
    react: () => <Timeline items={items} timePosition="opposite" />,
  },
  {
    name: 'opposite position without any time has no opposite region',
    vue: () => h(VTimeline, { items: [{ title: 'No time' }], timePosition: 'opposite' }),
    react: () => <Timeline items={[{ title: 'No time' }]} timePosition="opposite" />,
  },
  ...(['vertical', 'horizontal'] as const).flatMap(orientation =>
    (['start', 'end', 'alternate'] as const).map(align => ({
      name: `${orientation} ${align}`,
      vue: () => h(VTimeline, { items, orientation, align, timePosition: 'opposite' }),
      react: () => (
        <Timeline items={items} orientation={orientation} align={align} timePosition="opposite" />
      ),
    })),
  ),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size} with root tone`,
    vue: () => h(VTimeline, { items, size, tone: 'neutral' }),
    react: () => <Timeline items={items} size={size} tone="neutral" />,
  })),
  {
    name: 'attributes, direction and class merge',
    vue: () =>
      h(VTimeline, {
        items,
        orientation: 'horizontal',
        align: 'alternate',
        reverse: true,
        timePosition: 'opposite',
        dir: 'rtl',
        'aria-label': 'Changes',
        class: 'w-72 gap-0',
      }),
    react: () => (
      <Timeline
        items={items}
        orientation="horizontal"
        align="alternate"
        reverse
        timePosition="opposite"
        dir="rtl"
        aria-label="Changes"
        className="w-72 gap-0"
      />
    ),
  },
  {
    name: 'every scoped slot with custom fields, opposite wins over time',
    vue: () =>
      h(
        VTimeline,
        { items: custom, timePosition: 'opposite' },
        {
          marker: (props: TimelineSlotProps<Custom>) =>
            h('span', { 'data-marker': '' }, scope(props)),
          title: (props: TimelineSlotProps<Custom>) => h('strong', scope(props)),
          description: (props: TimelineSlotProps<Custom>) =>
            h('a', { href: '#details' }, scope(props)),
          opposite: (props: TimelineSlotProps<Custom>) =>
            h('span', { 'data-opposite': '' }, scope(props)),
          time: () => h('span', 'Overridden time'),
        },
      ),
    react: () => (
      <Timeline
        items={custom}
        timePosition="opposite"
        renderMarker={props => <span data-marker="">{scope(props)}</span>}
        renderTitle={props => <strong>{scope(props)}</strong>}
        renderDescription={props => <a href="#details">{scope(props)}</a>}
        renderOpposite={props => <span data-opposite="">{scope(props)}</span>}
        renderTime={() => <span>Overridden time</span>}
      />
    ),
  },
  {
    name: 'time slot in content position',
    vue: () =>
      h(
        VTimeline,
        { items: custom },
        { time: (props: TimelineSlotProps<Custom>) => h('em', scope(props)) },
      ),
    react: () => <Timeline items={custom} renderTime={props => <em>{scope(props)}</em>} />,
  },
  {
    name: 'time slot in opposite position',
    vue: () =>
      h(
        VTimeline,
        { items: custom, timePosition: 'opposite' },
        { time: (props: TimelineSlotProps<Custom>) => h('em', scope(props)) },
      ),
    react: () => (
      <Timeline
        items={custom}
        timePosition="opposite"
        renderTime={props => <em>{scope(props)}</em>}
      />
    ),
  },
  {
    name: 'content slot replaces every default',
    vue: () =>
      h(
        VTimeline,
        { items, reverse: true },
        { content: ({ item, index }: TimelineSlotProps) => h('button', `${index}:${item.id}`) },
      ),
    react: () => (
      <Timeline
        items={items}
        reverse
        renderContent={({ item, index }) => <button>{`${index}:${item.id}`}</button>}
      />
    ),
  },
])
