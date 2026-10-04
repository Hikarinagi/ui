import { Avatar, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Avatar src="/avatars/paper.webp" alt="Shion Hoshimi" />
      <Avatar name="Shion Hoshimi" />
      <Avatar />
    </Inline>
  )
}
