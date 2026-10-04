import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Masonry } from './Masonry'

it('renders every item in data order as a readable grid, without client geometry', async () => {
  const html = renderToString(
    <Masonry items={[3, 1, 2]} getKey={item => Number(item)} label="Gallery" minColumnWidth={180}>
      {({ item }) => <button>{`Item ${item}`}</button>}
    </Masonry>,
  )
  expect(html).toContain('role="list"')
  expect(html).toContain('aria-label="Gallery"')
  expect(html).toContain('--hn-masonry-min-width:180px')
  expect(html.match(/<li/g)).toHaveLength(3)
  expect(html.indexOf('Item 3')).toBeLessThan(html.indexOf('Item 1'))
  expect(html.indexOf('Item 1')).toBeLessThan(html.indexOf('Item 2'))
  expect(html).not.toContain('data-ready')
  expect(html).not.toContain('position:absolute')
})
it('renders fixed columns and meaningful empty/loading states on the server', async () => {
  const render = (loading: boolean) =>
    renderToString(
      <Masonry<unknown>
        items={[]}
        getKey={() => ''}
        columns={2}
        loading={loading}
        emptyText="Nothing saved"
      >
        {() => null}
      </Masonry>,
    )
  expect(render(false)).toContain('Nothing saved')
  const loading = render(true)
  expect(loading).toContain('--hn-masonry-fixed-columns:2')
  expect(loading).toContain('aria-busy="true"')
  expect(loading).toContain('role="status"')
  expect(loading).not.toContain('Nothing saved')
})

it('renders pending and the same measurable items, hidden from interaction and accessibility', async () => {
  const html = renderToString(
    <Masonry
      items={[1, 2]}
      getKey={item => Number(item)}
      label="Photos"
      pending={<div>Photo placeholders</div>}
    >
      {({ item }) => <button>{`Photo ${item}`}</button>}
    </Masonry>,
  )
  expect(html).toContain('data-hn-masonry-pending')
  expect(html).toContain('Photo placeholders')
  expect(html).toContain('data-pending')
  expect(html).toMatch(/<ul[^>]*aria-hidden="true"[^>]*inert/)
  expect(html.match(/<li/g)).toHaveLength(2)
  expect(html).toContain('Photo 1')
  expect(html).not.toContain('data-ready')
})

it('uses pending for an initial request, while an idle empty list renders its empty state', async () => {
  const render = (loading: boolean) =>
    renderToString(
      <Masonry<unknown>
        items={[]}
        getKey={() => ''}
        loading={loading}
        pending="Preparing cards"
        loadingContent="Appending cards"
        empty="No cards"
      />,
    )
  const loading = render(true)
  expect(loading).toContain('Preparing cards')
  expect(loading).not.toContain('Appending cards')
  expect(loading).not.toContain('No cards')
  const empty = render(false)
  expect(empty).toContain('No cards')
  expect(empty).not.toContain('Preparing cards')
})
