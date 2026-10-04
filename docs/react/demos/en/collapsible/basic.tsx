import { Collapsible, CollapsibleContent, CollapsibleTrigger, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Collapsible className="w-full max-w-md">
      <Stack gap="sm" align="start">
        <CollapsibleTrigger>Reading settings</CollapsibleTrigger>
        <CollapsibleContent>
          <Text tone="muted" size="sm">
            Type size, line height, page direction and background colour all live here.
          </Text>
        </CollapsibleContent>
      </Stack>
    </Collapsible>
  )
}
