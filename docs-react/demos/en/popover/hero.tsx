import { Settings2 } from 'lucide-react'
import { Button, Heading, Input, Popover, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Popover
      align="start"
      content={
        <Stack gap="sm" className="w-60">
          <Stack gap="xs">
            <Heading level={4} size="sm">
              Reading settings
            </Heading>
            <Text tone="muted" size="sm">
              Adjust the width and line height of the text.
            </Text>
          </Stack>
          <Stack gap="xs">
            <Text size="sm">Body width</Text>
            <Input defaultValue="720" size="sm" />
          </Stack>
          <Stack gap="xs">
            <Text size="sm">Line height</Text>
            <Input defaultValue="1.8" size="sm" />
          </Stack>
          <Button size="sm">Save</Button>
        </Stack>
      }
    >
      <Button variant="outline" tone="neutral" icon={<Settings2 />}>
        Reading settings
      </Button>
    </Popover>
  )
}
