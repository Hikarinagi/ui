import { Chip, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Chip selectable disabled>
        Unselected
      </Chip>
      <Chip selectable selected disabled>
        Selected
      </Chip>
      <Chip removable disabled>
        Locked
      </Chip>
    </Inline>
  )
}
