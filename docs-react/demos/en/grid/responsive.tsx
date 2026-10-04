import { Card, Grid, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm" className="w-full max-w-2xl">
      <Text tone="muted" size="sm">
        Two columns on a narrow screen, four on a wide one
      </Text>
      <Grid cols={2} className="sm:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <Card key={i} className="bg-inset h-12" padded={false} />
        ))}
      </Grid>
    </Stack>
  )
}
