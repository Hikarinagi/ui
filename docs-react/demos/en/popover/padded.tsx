import { Button, Divider, Popover, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Popover
      padded={false}
      align="start"
      content={
        <Stack gap="none" className="w-64">
          <Stack gap="none" className="bg-inset px-4 py-3">
            <Text size="sm" className="font-medium">
              Chapter 42
            </Text>
          </Stack>
          <Divider />
          <Stack gap="xs" className="px-4 py-3">
            <Text tone="muted" size="sm">
              Written by Isuna Hasekura
            </Text>
            <Text tone="muted" size="sm">
              Updated three hours ago
            </Text>
          </Stack>
        </Stack>
      }
    >
      <Button variant="outline" tone="neutral">
        Latest update
      </Button>
    </Popover>
  )
}
