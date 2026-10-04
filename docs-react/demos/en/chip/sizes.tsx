import { Chip, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <Chip size="sm" selectable selected>
        Small
      </Chip>
      <Chip size="sm" removable>
        Small
      </Chip>
      <Chip selectable selected>
        Medium
      </Chip>
      <Chip removable>Medium</Chip>
    </Inline>
  )
}
