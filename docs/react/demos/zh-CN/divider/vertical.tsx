import { Divider, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline className="h-8">
      <Text tone="muted" size="sm">
        128 本
      </Text>
      <Divider orientation="vertical" />
      <Text tone="muted" size="sm">
        32 位译者
      </Text>
      <Divider orientation="vertical" />
      <Text tone="muted" size="sm">
        更新于三小时前
      </Text>
    </Inline>
  )
}
