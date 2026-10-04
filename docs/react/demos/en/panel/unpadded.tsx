import { Avatar, Inline, Panel, Stack, Text } from '@hina-ui/react'

const members = [
  { name: 'Hoshimi Shion', src: '/avatars/selfie.webp', role: 'Admin' },
  { name: 'Peek', src: '/avatars/peek.webp', role: 'Member' },
  { name: 'Glass', src: '/avatars/glass.webp', role: 'Member' },
]

export default function Demo() {
  return (
    <Panel title="Members" count={members.length} padded={false} className="w-96">
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
