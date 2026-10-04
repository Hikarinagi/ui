import { Chip, Inline } from '@hina-ui/react'

const href = '/components/tag'

export default function Demo() {
  return (
    <Inline>
      <Chip as="a" href={href}>
        科幻
      </Chip>
      <Chip as="a" href={href}>
        校园
      </Chip>
      <Chip as="a" href={href} variant="outline">
        恋爱
      </Chip>
    </Inline>
  )
}
