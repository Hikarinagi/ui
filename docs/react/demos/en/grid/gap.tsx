import { Card, Grid, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          At md: 12 pixels between columns, 16 between rows
        </Text>
        <Grid cols={3} gap="md">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="bg-inset h-10" padded={false} />
          ))}
        </Grid>
      </Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          Every other step is the same on both axes, here lg at 24
        </Text>
        <Grid cols={3} gap="lg">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="bg-inset h-10" padded={false} />
          ))}
        </Grid>
      </Stack>
    </Stack>
  )
}
