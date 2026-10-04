import { Heading, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Heading level={1}>Spice and Wolf</Heading>
      <Text tone="muted">Dengeki Bunko, published 10 February 2006.</Text>
      <Heading level={2}>Volume One: Setting Out</Heading>
      <Heading level={3}>Chapter One: Morning at the Harbour</Heading>
    </Stack>
  )
}
