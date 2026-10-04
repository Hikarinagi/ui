import { Tag, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Tag className="max-w-40" tone="accent">
      <Text as="span" truncate>
        A very long tag name truncated at the container edge
      </Text>
    </Tag>
  )
}
