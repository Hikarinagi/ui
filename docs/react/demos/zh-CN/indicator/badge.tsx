import { Avatar, Badge, Indicator, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="lg">
      <Badge
        content={<Indicator tone="success" size="lg" />}
        bare
        label="在线"
        placement="bottom-end"
        shape="circle"
      >
        <Avatar src="/avatars/paper.webp" alt="星见书音" />
      </Badge>
      <Badge
        content={<Indicator tone="warning" size="lg" />}
        bare
        label="离开"
        placement="bottom-end"
        shape="circle"
      >
        <Avatar name="星见书音" />
      </Badge>
    </Inline>
  )
}
