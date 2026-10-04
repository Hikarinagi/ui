import { Heading, Inline, Stack, Text } from '@hina-ui/react'

const aligns = ['start', 'center', 'end', 'baseline', 'stretch'] as const

export default function Demo() {
  return (
    <Stack>
      {aligns.map(align => (
        <Stack key={align} gap="xs">
          <Text tone="muted" size="sm">
            {align}
          </Text>
          <Inline align={align} className="bg-inset rounded-md p-3">
            <Heading level={3} size="xl">
              Heading
            </Heading>
            <Text>Body</Text>
            <Text tone="muted" size="sm">
              Note
            </Text>
          </Inline>
        </Stack>
      ))}
    </Stack>
  )
}
