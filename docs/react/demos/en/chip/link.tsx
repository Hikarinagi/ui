import { Chip, Inline } from '@hina-ui/react'

const href = '/en/components/tag'

export default function Demo() {
  return (
    <Inline>
      <Chip as="a" href={href}>
        Sci-fi
      </Chip>
      <Chip as="a" href={href}>
        School
      </Chip>
      <Chip as="a" href={href} variant="outline">
        Romance
      </Chip>
    </Inline>
  )
}
