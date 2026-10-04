import { DateTimePicker, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80">
      <DateTimePicker value="2026-09-04T20:00" invalid aria-label="Invalid" />
      <DateTimePicker value="2026-09-04T20:00" disabled aria-label="Disabled" />
      <DateTimePicker value="2026-09-04T20:00" readonly aria-label="Read only" />
      <DateTimePicker value="2026-09-04T20:00" variant="secondary" aria-label="Secondary" />
    </Stack>
  )
}
