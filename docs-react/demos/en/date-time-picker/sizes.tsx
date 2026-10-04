import { DateTimePicker, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80">
      <DateTimePicker size="sm" value="2026-09-04T20:00" aria-label="Small" />
      <DateTimePicker size="md" value="2026-09-04T20:00" aria-label="Medium" />
      <DateTimePicker size="lg" value="2026-09-04T20:00" aria-label="Large" />
    </Stack>
  )
}
