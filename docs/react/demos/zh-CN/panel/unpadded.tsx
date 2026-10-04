import { Avatar, Inline, Panel, Stack, Text } from '@hina-ui/react'

const members = [
  { name: '星见书音', src: '/avatars/selfie.webp', role: '管理员' },
  { name: '偷瞄', src: '/avatars/peek.webp', role: '成员' },
  { name: '玻璃', src: '/avatars/glass.webp', role: '成员' },
]

export default function Demo() {
  return (
    <Panel title="成员" count={members.length} padded={false} className="w-96">
      <Stack gap="none" align="stretch" className="divide-line divide-y">
        {members.map(member => (
          <Inline key={member.name} gap="sm" align="center" className="px-(--hn-panel-p) py-2.5">
            <Avatar src={member.src} name={member.name} size="sm" />
            <Text size="sm">{member.name}</Text>
            <Text size="sm" tone="muted">
              {member.role}
            </Text>
          </Inline>
        ))}
      </Stack>
    </Panel>
  )
}
