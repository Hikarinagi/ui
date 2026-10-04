import { Callout } from '@hina-ui/react'

export default function Demo() {
  return (
    <Callout tone="warning" title="Chapters follow the print order" className="max-w-md">
      Some works were serialised in a different order from their collected volumes; the site follows
      the volumes.
    </Callout>
  )
}
