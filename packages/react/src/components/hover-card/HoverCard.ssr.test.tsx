import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { HoverCard } from './HoverCard'

describe('HoverCard SSR', () => {
  it('renders the ordinary trigger without browser globals', () => {
    const html = renderToString(
      <HoverCard positionerClass="positioner-only" content="Content">
        <a href="#">Trigger</a>
      </HoverCard>,
    )
    expect(html).toContain('Trigger')
    expect(html).not.toContain('positioner-only')
    expect(html).not.toContain('data-hn-hover-card')
  })

  it('allows an empty trigger slot and a null external anchor during server rendering', () => {
    const html = renderToString(
      <HoverCard anchor={null} open positionerClass="positioner-only" content="Content" />,
    )
    expect(html).not.toContain('data-hn-hover-card')
  })
})
