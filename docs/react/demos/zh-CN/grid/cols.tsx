import { Card, Grid, Stack, Text } from '@hina-ui/react'

const counts = [2, 3, 4, 6] as const

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      {counts.map(cols => (
        <Stack key={cols} gap="xs">
          <Text tone="muted" size="sm">
            cols {cols}
          </Text>
          <Grid cols={cols} gap="sm">
            {Array.from({ length: cols }, (_, i) => i + 1).map(i => (
              <Card
                key={i}
                className="bg-inset grid h-10 place-items-center text-sm"
                padded={false}
              >
                {i}
              </Card>
            ))}
          </Grid>
        </Stack>
      ))}
    </Stack>
  )
}
