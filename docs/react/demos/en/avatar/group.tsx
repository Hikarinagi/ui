import { Avatar, AvatarGroup, Stack, Text } from '@hina-ui/react'

const members = [
  { src: '/avatars/paper.webp', name: 'Shion Hoshimi' },
  { src: '/avatars/peek.webp', name: 'Peek' },
  { src: '/avatars/glass.webp', name: 'Glass' },
  { src: '/avatars/huh.webp', name: 'Huh' },
  { src: '/avatars/run.webp', name: 'Run' },
  { src: '/avatars/sleep.webp', name: 'Sleep' },
]

export default function Demo() {
  return (
    <Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          All of them
        </Text>
        <AvatarGroup>
          {members.slice(0, 4).map(m => (
            <Avatar key={m.name} src={m.src} alt={m.name} />
          ))}
        </AvatarGroup>
      </Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          Three at most, the rest folded into a count
        </Text>
        <AvatarGroup max={3} size="lg">
          {members.map(m => (
            <Avatar key={m.name} src={m.src} alt={m.name} />
          ))}
        </AvatarGroup>
      </Stack>
    </Stack>
  )
}
