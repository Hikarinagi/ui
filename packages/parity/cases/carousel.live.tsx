import { h, type Component } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VCarouselComponent from '@hina-ui/vue/components/carousel/Carousel.vue'
import { Carousel } from '@hina-ui/react/components/carousel/Carousel'
import type { CarouselProps } from '@hina-ui/react/components/carousel/types'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const VCarousel = VCarouselComponent as unknown as Component
type Item = { id: number; title: string }
const items: Item[] = Array.from({ length: 5 }, (_, id) => ({ id, title: `Item ${id + 1}` }))
const getKey = (item: Item) => item.id
type Props = Partial<CarouselProps<Item>> & Record<string, unknown>

async function settled() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-hn-carousel][data-ready]')) throw new Error('not ready')
  })
  let previous = ''
  let stable = 0
  while (stable < 10) {
    await frames(1)
    const current = [...document.querySelectorAll<HTMLElement>('.hn-carousel-track')]
      .map(track => track.style.transform)
      .join('|')
    stable = current === previous ? stable + 1 : 0
    previous = current
  }
  await frames()
}

async function idle() {
  await frames(10)
}

function slide(item: Item) {
  return { style: 'height:120px', text: item.title }
}

function live(name: string, props: Props, extra: Partial<LiveCase> = {}): LiveCase {
  const { className, ...rest } = props
  return {
    name,
    vue: () =>
      h(
        VCarousel,
        { items, getKey, ...rest, ...(className ? { class: className } : {}) },
        {
          default: ({ item }: { item: Item }) =>
            h('div', { style: slide(item).style }, slide(item).text),
        },
      ),
    react: () => (
      <Carousel<Item> items={items} getKey={getKey} {...(props as object)}>
        {({ item }) => <div style={{ height: '120px' }}>{item.title}</div>}
      </Carousel>
    ),
    settle: settled,
    ...extra,
  }
}

const click = (selector: string) => async (container: HTMLElement) => {
  await settled()
  await userEvent.click(container.querySelector<HTMLElement>(selector)!)
}

export default defineLiveCases('Carousel', [
  live('after engine initialization', { indicators: true, index: 1, className: 'w-[480px]' }),
  live(
    'after next-button navigation',
    { indicators: true, className: 'w-[480px]' },
    { interact: click('button[aria-label="下一组"]') },
  ),
  live(
    'after indicator navigation',
    { indicators: true, className: 'w-[480px]' },
    { interact: click('button[aria-label="转到第 4 组"]') },
  ),
  live(
    'keyboard navigation from the viewport',
    { indicators: true, className: 'w-[480px]' },
    {
      interact: async container => {
        await settled()
        container.querySelector<HTMLElement>('[data-hn-carousel-viewport]')!.focus()
        await userEvent.keyboard('{ArrowRight}{ArrowRight}')
      },
    },
  ),
  live('vertical after initialization', {
    orientation: 'vertical',
    viewportClass: 'h-80',
    itemClass: 'basis-1/2',
    index: 1,
    className: 'w-[480px]',
  }),
  live(
    'rtl after next-button navigation',
    { dir: 'rtl', indicators: true, className: 'w-[480px]' },
    { interact: click('button[aria-label="下一组"]') },
  ),
  live('grouped measured snaps', {
    slidesToScroll: 'auto',
    itemClass: 'basis-1/3',
    indicators: true,
    className: 'w-[480px]',
  }),
  live('loop with gap xl at the last item', {
    loop: true,
    gap: 'xl',
    index: 4,
    className: 'w-[480px]',
  }),
  live('autoplay rotation control while playing', {
    autoplay: 60000,
    loop: true,
    indicators: true,
    className: 'w-[480px]',
  }),
  live(
    'autoplay rotation control after pausing',
    { autoplay: 60000, loop: true, className: 'w-[480px]' },
    { interact: click('[data-hn-carousel-rotation]') },
  ),
  {
    name: 'empty state',
    vue: () => h(VCarousel, { items: [], getKey }, { default: () => null }),
    react: () => (
      <Carousel<Item> items={[]} getKey={getKey}>
        {() => null}
      </Carousel>
    ),
    settle: idle,
  },
  {
    name: 'pending slot replaced after initialization',
    vue: () =>
      h(
        VCarousel,
        { items, getKey, index: 2, class: 'w-[480px]' },
        {
          default: ({ item }: { item: Item }) => h('div', { style: 'height:120px' }, item.title),
          pending: () => h('div', { style: 'height:120px' }, 'Loading'),
        },
      ),
    react: () => (
      <Carousel<Item>
        items={items}
        getKey={getKey}
        index={2}
        className="w-[480px]"
        pending={<div style={{ height: '120px' }}>Loading</div>}
      >
        {({ item }) => <div style={{ height: '120px' }}>{item.title}</div>}
      </Carousel>
    ),
    settle: settled,
  },
])
