import { Inline, Rating, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="sm">
      <Rating value={4.3} readonly />
      <Text tone="muted" size="sm">
        4.3 分，共 128 人评分
      </Text>
    </Inline>
  )
}
