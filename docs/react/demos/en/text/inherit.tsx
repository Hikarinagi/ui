import { Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Text size="sm">
        sm parent text,{' '}
        <Text as="span" size="inherit" tone="accent">
          inherited size and line height
        </Text>{' '}
        .
      </Text>
      <Text size="base">
        base parent text,{' '}
        <Text as="span" size="inherit" tone="accent">
          inherited size and line height
        </Text>{' '}
        .
      </Text>
      <Text size="xl">
        xl parent text,{' '}
        <Text as="span" size="inherit" tone="accent">
          inherited size and line height
        </Text>{' '}
        .
      </Text>
    </Stack>
  )
}
