import { Progress, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="lg" className="w-80">
      <Progress value={60} size="sm" />
      <Progress value={60} />
      <Progress value={60} size="lg" />
    </Stack>
  )
}
