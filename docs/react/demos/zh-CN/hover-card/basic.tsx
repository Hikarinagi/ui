import { HoverCard, Link, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <HoverCard
      content={
        <Stack gap="xs" className="w-64">
          <Text weight="medium">Reka UI</Text>
          <Text tone="muted" size="sm">
            一套无样式、可访问的 Vue 组件基础，本库的大部分交互件建在它上面。
          </Text>
        </Stack>
      }
    >
      <Link href="#">Reka UI</Link>
    </HoverCard>
  )
}
