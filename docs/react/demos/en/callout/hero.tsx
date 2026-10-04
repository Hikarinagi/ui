import { Callout } from '@hina-ui/react'

export default function Demo() {
  return (
    <Callout tone="accent" title="The reader supports two-page spreads" className="max-w-md">
      In landscape it switches to a two-page layout on its own, and reading settings can pin it to a
      single page.
    </Callout>
  )
}
