import { Inline, Stack, Tag, Text } from '@hina-ui/react'

const tags = ['科幻', '悬疑', '校园', '青春', '治愈', '日常', '成长', '群像', '异世界']

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm">
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          wrap 默认为真，放不下时换行
        </Text>
        <Inline gap="xs">
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Inline>
      </Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          wrap 为假时保持在一行
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
