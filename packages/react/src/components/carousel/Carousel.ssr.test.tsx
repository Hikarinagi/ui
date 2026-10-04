import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Carousel } from './Carousel'
import type { CarouselIndicatorSlot, CarouselIndicatorsSlot } from './types'

it('renders custom indicators with the selected snap during SSR without requiring the indicators prop', () => {
  const html = renderToString(
    <Carousel<number>
      items={[1, 2, 3]}
      getKey={n => n}
      index={1}
      renderIndicator={({ index, active, snapCount }: CarouselIndicatorSlot) => (
        <span>{`${index + 1}/${snapCount}/${active}`}</span>
      )}
    >
      {({ item }) => <span>{item}</span>}
    </Carousel>,
  )
  expect(html.match(/data-hn-carousel-indicator(?:\s|=|>)/g)).toHaveLength(3)
  expect(html).toContain('2/3/true')
  expect(html).toContain('1/3/false')
  expect(html).toContain('aria-label="转到第 2 组"')
})

it('renders a custom group during SSR and gives a full controls slot precedence', () => {
  const render = (full: boolean) =>
    renderToString(
      <Carousel<number>
        items={[1, 2, 3]}
        getKey={n => n}
        index={1}
        renderIndicators={({ index, snapCount, viewportId }: CarouselIndicatorsSlot) => (
          <output aria-controls={viewportId}>{`Group ${index + 1}/${snapCount}`}</output>
        )}
        {...(full ? { renderControls: () => <span>Full controls</span> } : {})}
      >
        {({ item }) => <span>{item}</span>}
      </Carousel>,
    )
  const group = render(false)
  expect(group).toContain('Group 2/3')
  expect(group).toContain('aria-label="上一组"')
  expect(group).toContain('aria-label="下一组"')
  const full = render(true)
  expect(full).toContain('Full controls')
  expect(full).not.toContain('Group 2/3')
  expect(full).not.toContain('data-hn-carousel-indicators')
})

it('renders all keyed slide content and accessible controls without a browser', () => {
  const html = renderToString(
    <Carousel<number> items={[1, 2, 3]} getKey={n => n} label="Gallery" indicators index={1}>
      {({ item }) => <a href={`/item/${item}`}>{`Item ${item}`}</a>}
    </Carousel>,
  )
  expect(html.match(/data-hn-carousel-item/g)).toHaveLength(3)
  expect(html).toContain('aria-roledescription="轮播"')
  expect(html).toContain('aria-label="Gallery"')
  expect(html).toContain('href="/item/3"')
  expect(html).not.toContain('data-ready')
  expect(html).not.toContain('data-pending')
  expect(html).toContain('data-initial-index="1"')
  expect(html).toContain('--hn-carousel-initial-index:1')
  expect(html.match(/aria-label="转到第 \d 组"/g)).toHaveLength(3)
  expect(html).toContain('aria-label="转到第 2 组"')
  expect(html.match(/data-current=""/g)).toHaveLength(1)
  expect(html.match(/inert/g)).toHaveLength(2)
  expect(html).not.toMatch(/\sdisabled(?:\s|=|>)/)
})

it.each([
  { index: -1, selected: 0, prev: false, next: true },
  { index: 999, selected: 2, prev: true, next: false },
  { index: NaN, selected: 0, prev: false, next: true },
  { index: 0, loop: true, selected: 0, prev: true, next: true },
])('renders clamped selection and navigation in the controls slot: %o', test => {
  const { selected, prev, next, ...props } = test
  const html = renderToString(
    <Carousel<number>
      items={[1, 2, 3]}
      getKey={n => n}
      {...props}
      renderControls={state => (
        <output>{`${state.index}/${state.snapCount}/${state.canPrev}/${state.canNext}`}</output>
      )}
    >
      {({ item }) => <span>{item}</span>}
    </Carousel>,
  )
  expect(html).toContain(`<output>${selected}/3/${prev}/${next}</output>`)
})
it('renders a measurement placeholder with hidden measurable content, or an empty state', () => {
  const html = renderToString(
    <Carousel<number> items={[1, 2]} getKey={n => n} index={1} pending={<span>Placeholder</span>}>
      {({ item }) => <span>{item}</span>}
    </Carousel>,
  )
  expect(html).toContain('data-pending')
  expect(html).toMatch(/aria-hidden="true" inert=""/)
  expect(html).toContain('Placeholder')
  const empty = renderToString(
    <Carousel<number> items={[]} getKey={n => n}>
      {() => null}
    </Carousel>,
  )
  expect(empty).toContain('暂无内容')
})

it('renders the initial track translation and hides an empty viewport on the server', () => {
  const html = renderToString(
    <Carousel<number> items={[1, 2, 3]} getKey={n => n} index={2}>
      {({ item }) => <span>{item}</span>}
    </Carousel>,
  )
  expect(html).toContain('style="--hn-carousel-initial-index:2"')
  const deferred = renderToString(
    <Carousel<number> items={[1, 2, 3]} getKey={n => n} itemClass="basis-1/2">
      {({ item }) => <span>{item}</span>}
    </Carousel>,
  )
  expect(deferred).not.toContain('--hn-carousel-initial-index')
  const empty = renderToString(
    <Carousel<number> items={[]} getKey={n => n}>
      {() => null}
    </Carousel>,
  )
  expect(empty).toContain('style="display:none"')
})
