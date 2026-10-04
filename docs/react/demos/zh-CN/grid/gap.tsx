import { Card, Grid, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          md 档：列间 12 像素，行间 16 像素
        </Text>
        <Grid cols={3} gap="md">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="bg-inset h-10" padded={false} />
          ))}
        </Grid>
      </Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          其余档位两轴相同，这里是 lg 的 24 像素
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
