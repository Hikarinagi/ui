import { Calendar, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="lg" align="start">
      <Calendar size="sm" defaultValue="2026-09-04" />
      <Calendar size="md" defaultValue="2026-09-04" />
      <Calendar size="lg" defaultValue="2026-09-04" />
    </Stack>
  )
}
