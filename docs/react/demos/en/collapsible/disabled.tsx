import { Collapsible, CollapsibleContent, CollapsibleTrigger, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Collapsible disabled className="w-full max-w-md">
      <Stack gap="sm" align="start">
        <CollapsibleTrigger>Edit history (sign in required)</CollapsibleTrigger>
        <CollapsibleContent>
          <Text tone="muted" size="sm">
            This section will not open.
          </Text>
        </CollapsibleContent>
      </Stack>
    </Collapsible>
  )
}
