import { Button, Inline, Stack, Text } from '@hina-ui/react'

const aligns = ['start', 'center', 'end', 'stretch'] as const

export default function Demo() {
  return (
    <Inline align="start" className="gap-6">
      {aligns.map(align => (
        <Stack key={align} gap="xs" className="w-44">
          <Text tone="muted" size="sm">
            {align}
          </Text>
          <Stack align={align} gap="sm" className="bg-inset rounded-md p-3">
            <Button size="sm" variant="soft" tone="neutral">
              Short
            </Button>
            <Button size="sm" variant="soft" tone="neutral">
              A longer button
            </Button>
          </Stack>
        </Stack>
      ))}
    </Inline>
  )
}
