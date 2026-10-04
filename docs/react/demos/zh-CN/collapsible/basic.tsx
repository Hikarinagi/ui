import { Collapsible, CollapsibleContent, CollapsibleTrigger, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Collapsible className="w-full max-w-md">
      <Stack gap="sm" align="start">
        <CollapsibleTrigger>阅读设置</CollapsibleTrigger>
        <CollapsibleContent>
          <Text tone="muted" size="sm">
            字号、行距、翻页方向与背景色都在这里调整。
          </Text>
        </CollapsibleContent>
      </Stack>
    </Collapsible>
  )
}
