import { Inline, Stack, Tag, Text } from '@hina-ui/react'

const tags = [
  'Sci-fi',
  'Mystery',
  'School',
  'Coming of age',
  'Healing',
  'Slice of life',
  'Ensemble',
  'Isekai',
]

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm">
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          wrap defaults to true, so items wrap when they run out of room
        </Text>
        <Inline gap="xs">
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Inline>
      </Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          With wrap false they stay on one line
        </Text>
        <Inline wrap={false} gap="xs" className="overflow-hidden">
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Inline>
      </Stack>
    </Stack>
  )
}
