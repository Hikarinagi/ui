import { Chip, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <Chip size="sm" selectable selected>
        小号
      </Chip>
      <Chip size="sm" removable>
        小号
      </Chip>
      <Chip selectable selected>
        中号
      </Chip>
      <Chip removable>中号</Chip>
    </Inline>
  )
}
