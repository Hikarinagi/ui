import { Avatar, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Avatar src="/avatars/paper.webp" alt="星见书音" />
      <Avatar name="星见书音" />
      <Avatar />
    </Inline>
  )
}
