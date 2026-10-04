import { Chip, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Chip selectable>soft</Chip>
      <Chip selectable tone="accent">
        soft accent
      </Chip>
      <Chip selectable variant="outline">
        outline
      </Chip>
      <Chip selectable variant="outline" tone="accent">
        outline accent
      </Chip>
    </Inline>
  )
}
