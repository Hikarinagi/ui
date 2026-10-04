import { Avatar, Badge, Indicator, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="lg">
      <Badge
        content={<Indicator tone="success" size="lg" />}
        bare
        label="Online"
        placement="bottom-end"
        shape="circle"
      >
        <Avatar src="/avatars/paper.webp" alt="Hoshimi Shion" />
      </Badge>
      <Badge
        content={<Indicator tone="warning" size="lg" />}
        bare
        label="Away"
        placement="bottom-end"
        shape="circle"
      >
        <Avatar name="Hoshimi Shion" />
      </Badge>
    </Inline>
  )
}
