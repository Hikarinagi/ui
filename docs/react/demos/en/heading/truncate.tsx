import { Heading } from '@hina-ui/react'

export default function Demo() {
  return (
    <Heading level={3} truncate className="max-w-xs">
      A very long section title truncated at the container edge with an ellipsis
    </Heading>
  )
}
