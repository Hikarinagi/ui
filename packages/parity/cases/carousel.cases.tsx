import { h, type Component } from 'vue'
import VCarouselComponent from '@hina-ui/vue/components/carousel/Carousel.vue'
import VCard from '@hina-ui/vue/components/card/Card.vue'
import VStack from '@hina-ui/vue/components/stack/Stack.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import VLink from '@hina-ui/vue/components/link/Link.vue'
import VInline from '@hina-ui/vue/components/inline/Inline.vue'
import VProgress from '@hina-ui/vue/components/progress/Progress.vue'
import { Carousel } from '@hina-ui/react/components/carousel/Carousel'
import { Card } from '@hina-ui/react/components/card/Card'
import { Stack } from '@hina-ui/react/components/stack/Stack'
import { Text } from '@hina-ui/react/components/text/Text'
import { Link } from '@hina-ui/react/components/link/Link'
import { Inline } from '@hina-ui/react/components/inline/Inline'
import { Progress } from '@hina-ui/react/components/progress/Progress'
import type {
  CarouselControls,
  CarouselIndicatorSlot,
  CarouselIndicatorsSlot,
  CarouselItemSlot,
  CarouselProps,
} from '@hina-ui/react/components/carousel/types'
import { defineCases, type ParityCase } from '../src/cases'

const VCarousel = VCarouselComponent as unknown as Component
type Item = { id: number; title: string }
const items: Item[] = Array.from({ length: 4 }, (_, id) => ({ id, title: `Item ${id + 1}` }))
const numbers = [1, 2, 3]
const getKey = (item: Item) => item.id
const numberKey = (n: number) => n

type Props = Partial<CarouselProps<Item>> & Record<string, unknown>

function vueSlide({ item }: { item: Item }) {
  return h('div', { style: 'height:160px' }, item.title)
}

function plain(name: string, props: Props): ParityCase {
  const { className, ...rest } = props
  return {
    name,
    vue: () =>
      h(
        VCarousel,
        { items, getKey, ...rest, ...(className ? { class: className } : {}) },
        { default: vueSlide },
      ),
    react: () => (
      <Carousel<Item> items={items} getKey={getKey} {...(props as object)}>
        {({ item }: CarouselItemSlot<Item>) => <div style={{ height: '160px' }}>{item.title}</div>}
      </Carousel>
    ),
  }
}

const controlsState = (state: CarouselControls) =>
  `${state.index}/${state.snapCount}/${state.canPrev}/${state.canNext}`

export default defineCases('Carousel', [
  plain('defaults', {}),
  plain('label, indicators and initial index', { label: 'Gallery', indicators: true, index: 1 }),
  {
    name: 'uncontrolled initial index',
    vue: () => h(VCarousel, { items, getKey, index: 2, indicators: true }, { default: vueSlide }),
    react: () => (
      <Carousel<Item> items={items} getKey={getKey} defaultIndex={2} indicators>
        {({ item }) => <div style={{ height: '160px' }}>{item.title}</div>}
      </Carousel>
    ),
  },
  ...(['none', 'xs', 'sm', 'lg', 'xl'] as const).map(gap => plain(`gap ${gap}`, { gap })),
  plain('vertical with viewport class', {
    orientation: 'vertical',
    viewportClass: 'h-80',
    indicators: true,
    index: 2,
  }),
  plain('rtl direction', { dir: 'rtl', index: 2, indicators: true }),
  plain('center alignment without containment', {
    align: 'center',
    containScroll: false,
    index: 2,
  }),
  plain('loop at the last item with gap xl', { loop: true, index: 3, gap: 'xl' }),
  plain('item class string defers layout', { itemClass: 'basis-1/2', indicators: true }),
  plain('item class function', {
    itemClass: (item: Item) => (item.id % 2 ? 'basis-1/2' : undefined),
  }),
  plain('slidesToScroll auto with basis-auto items', {
    slidesToScroll: 'auto',
    itemClass: 'basis-auto',
  }),
  plain('slidesToScroll auto keeps the initial layout', { slidesToScroll: 'auto', index: 1 }),
  plain('slidesToScroll 2 defers layout', { slidesToScroll: 2, indicators: true }),
  plain('autoplay shows the rotation control', { autoplay: 4000, loop: true, indicators: true }),
  plain('autoplay true', { autoplay: true }),
  plain('arrows hidden with indicators', { arrows: false, indicators: true }),
  plain('arrows hidden without indicators renders no controls', { arrows: false }),
  plain('class, id, data and style attributes', {
    className: 'max-w-lg',
    id: 'gallery',
    'data-testid': 'carousel',
    style: { width: '600px' },
    role: 'group',
    'aria-label': 'Override',
  }),
  plain('draggable and dragFree flags', { draggable: false, dragFree: true }),
  {
    name: 'single item with autoplay hides rotation',
    vue: () =>
      h(
        VCarousel,
        { items: items.slice(0, 1), getKey, autoplay: true, indicators: true },
        { default: vueSlide },
      ),
    react: () => (
      <Carousel<Item> items={items.slice(0, 1)} getKey={getKey} autoplay indicators>
        {({ item }) => <div style={{ height: '160px' }}>{item.title}</div>}
      </Carousel>
    ),
  },
  {
    name: 'custom indicator contents with the selected snap',
    vue: () =>
      h(
        VCarousel,
        { items: numbers, getKey: numberKey, index: 1 },
        {
          default: ({ item }: { item: number }) => h('span', item),
          indicator: ({ index, active, snapCount }: CarouselIndicatorSlot) =>
            h('span', `${index + 1}/${snapCount}/${active}`),
        },
      ),
    react: () => (
      <Carousel<number>
        items={numbers}
        getKey={numberKey}
        index={1}
        renderIndicator={({ index, active, snapCount }) => (
          <span>{`${index + 1}/${snapCount}/${active}`}</span>
        )}
      >
        {({ item }) => <span>{item}</span>}
      </Carousel>
    ),
  },
  {
    name: 'custom indicator group keeps arrows',
    vue: () =>
      h(
        VCarousel,
        { items: numbers, getKey: numberKey, index: 1 },
        {
          default: ({ item }: { item: number }) => h('span', item),
          indicators: ({ index, snapCount, viewportId }: CarouselIndicatorsSlot) =>
            h('output', { 'aria-controls': viewportId }, `Group ${index + 1}/${snapCount}`),
          indicator: () => h('span', 'Lower-priority indicator'),
        },
      ),
    react: () => (
      <Carousel<number>
        items={numbers}
        getKey={numberKey}
        index={1}
        renderIndicators={({ index, snapCount, viewportId }) => (
          <output aria-controls={viewportId}>{`Group ${index + 1}/${snapCount}`}</output>
        )}
        renderIndicator={() => <span>Lower-priority indicator</span>}
      >
        {({ item }) => <span>{item}</span>}
      </Carousel>
    ),
  },
  {
    name: 'full controls slot takes precedence',
    vue: () =>
      h(
        VCarousel,
        { items: numbers, getKey: numberKey, index: 1, indicators: true },
        {
          default: ({ item }: { item: number }) => h('span', item),
          indicators: () => h('output', 'Group'),
          controls: () => h('span', 'Full controls'),
        },
      ),
    react: () => (
      <Carousel<number>
        items={numbers}
        getKey={numberKey}
        index={1}
        indicators
        renderIndicators={() => <output>Group</output>}
        renderControls={() => <span>Full controls</span>}
      >
        {({ item }) => <span>{item}</span>}
      </Carousel>
    ),
  },
  ...[{ index: -1 }, { index: 999 }, { index: Number.NaN }, { index: 0, loop: true }].map(test => ({
    name: `clamped controls state ${JSON.stringify(test)}`,
    vue: () =>
      h(
        VCarousel,
        { items: numbers, getKey: numberKey, ...test },
        {
          default: ({ item }: { item: number }) => h('span', item),
          controls: (state: CarouselControls) => h('output', controlsState(state)),
        },
      ),
    react: () => (
      <Carousel<number>
        items={numbers}
        getKey={numberKey}
        {...test}
        renderControls={state => <output>{controlsState(state)}</output>}
      >
        {({ item }) => <span>{item}</span>}
      </Carousel>
    ),
  })),
  {
    name: 'item slot props',
    vue: () =>
      h(
        VCarousel,
        { items: numbers, getKey: numberKey, index: 2 },
        {
          default: ({ item, index, isVisible, ready }: CarouselItemSlot<number>) =>
            h('span', `${item}:${index}:${isVisible}:${ready}`),
        },
      ),
    react: () => (
      <Carousel<number> items={numbers} getKey={numberKey} index={2}>
        {({ item, index, isVisible, ready }) => (
          <span>{`${item}:${index}:${isVisible}:${ready}`}</span>
        )}
      </Carousel>
    ),
  },
  {
    name: 'pending placeholder hides measurable slides',
    vue: () =>
      h(
        VCarousel,
        { items: numbers, getKey: numberKey, index: 1 },
        {
          default: ({ item }: { item: number }) => h('span', item),
          pending: () => h('span', 'Placeholder'),
        },
      ),
    react: () => (
      <Carousel<number>
        items={numbers}
        getKey={numberKey}
        index={1}
        pending={<span>Placeholder</span>}
      >
        {({ item }) => <span>{item}</span>}
      </Carousel>
    ),
  },
  {
    name: 'empty state with the default text',
    vue: () => h(VCarousel, { items: [], getKey: numberKey }, { default: () => null }),
    react: () => (
      <Carousel<number> items={[]} getKey={numberKey}>
        {() => null}
      </Carousel>
    ),
  },
  {
    name: 'empty state with custom content and pending slot',
    vue: () =>
      h(
        VCarousel,
        { items: [], getKey: numberKey, indicators: true, autoplay: true },
        {
          default: () => null,
          empty: () => h('strong', 'Nothing here'),
          pending: () => h('span', 'Placeholder'),
        },
      ),
    react: () => (
      <Carousel<number>
        items={[]}
        getKey={numberKey}
        indicators
        autoplay
        empty={<strong>Nothing here</strong>}
        pending={<span>Placeholder</span>}
      >
        {() => null}
      </Carousel>
    ),
  },
  {
    name: 'hero demo cards',
    vue: () =>
      h(
        VCarousel,
        { items, getKey, label: '精选视觉小说', indicators: true, index: 0, class: 'max-w-2xl' },
        {
          default: ({ item }: { item: Item }) =>
            h(
              VCard,
              { padded: false, class: 'grid h-full grid-cols-1 overflow-hidden shadow-none' },
              () => [
                h('img', {
                  src: `/cover/${item.id}.png`,
                  alt: item.title,
                  draggable: 'false',
                  loading: 'lazy',
                }),
                h(VStack, { gap: 'sm', justify: 'center', class: 'min-w-0 px-4 py-5' }, () => [
                  h(VText, { as: 'h3', size: 'lg', weight: 'medium' }, () => item.title),
                  h(VLink, { href: `#${item.id}`, class: 'mt-3 w-fit text-sm' }, () => '查看作品'),
                ]),
              ],
            ),
        },
      ),
    react: () => (
      <Carousel<Item>
        items={items}
        getKey={getKey}
        label="精选视觉小说"
        indicators
        index={0}
        className="max-w-2xl"
      >
        {({ item }) => (
          <Card padded={false} className="grid h-full grid-cols-1 overflow-hidden shadow-none">
            <img src={`/cover/${item.id}.png`} alt={item.title} draggable="false" loading="lazy" />
            <Stack gap="sm" justify="center" className="min-w-0 px-4 py-5">
              <Text as="h3" size="lg" weight="medium">
                {item.title}
              </Text>
              <Link href={`#${item.id}`} className="mt-3 w-fit text-sm">
                查看作品
              </Link>
            </Stack>
          </Card>
        )}
      </Carousel>
    ),
  },
  {
    name: 'progress indicators demo',
    vue: () =>
      h(
        VCarousel,
        { items, getKey, indicators: true, index: 0, label: '自定义封面画廊' },
        {
          default: vueSlide,
          indicators: ({ index, snapCount }: CarouselIndicatorsSlot) =>
            h(VInline, { gap: 'sm', wrap: false, class: 'w-36' }, () => [
              h(VProgress, {
                value: index + 1,
                max: Math.max(1, snapCount),
                size: 'sm',
                'aria-label': '画廊进度',
                class: 'flex-1',
              }),
              h(
                VText,
                { size: 'xs', tone: 'muted', dir: 'ltr', class: 'shrink-0 tabular-nums' },
                () => `${index + 1} / ${snapCount}`,
              ),
            ]),
        },
      ),
    react: () => (
      <Carousel<Item>
        items={items}
        getKey={getKey}
        indicators
        index={0}
        label="自定义封面画廊"
        renderIndicators={({ index, snapCount }) => (
          <Inline gap="sm" wrap={false} className="w-36">
            <Progress
              value={index + 1}
              max={Math.max(1, snapCount)}
              size="sm"
              aria-label="画廊进度"
              className="flex-1"
            />
            <Text size="xs" tone="muted" dir="ltr" className="shrink-0 tabular-nums">
              {`${index + 1} / ${snapCount}`}
            </Text>
          </Inline>
        )}
      >
        {({ item }) => <div style={{ height: '160px' }}>{item.title}</div>}
      </Carousel>
    ),
  },
  {
    name: 'thumbnail indicator demo',
    vue: () =>
      h(
        VCarousel,
        { items, getKey, indicators: true, index: 0 },
        {
          default: vueSlide,
          indicator: ({ index, active }: CarouselIndicatorSlot) =>
            h('img', {
              src: `/thumb/${index}.png`,
              alt: '',
              loading: 'lazy',
              class: `w-8 rounded-sm ${active ? 'opacity-100' : 'opacity-50'}`,
            }),
        },
      ),
    react: () => (
      <Carousel<Item>
        items={items}
        getKey={getKey}
        indicators
        index={0}
        renderIndicator={({ index, active }) => (
          <img
            src={`/thumb/${index}.png`}
            alt=""
            loading="lazy"
            className={`w-8 rounded-sm ${active ? 'opacity-100' : 'opacity-50'}`}
          />
        )}
      >
        {({ item }) => <div style={{ height: '160px' }}>{item.title}</div>}
      </Carousel>
    ),
  },
])
