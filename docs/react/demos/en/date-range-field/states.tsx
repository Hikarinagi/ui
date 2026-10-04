import { DateRangeField, Stack } from '@hina-ui/react'

export default function Demo() {
  const range = { start: '2026-09-01', end: '2026-09-30' }
  return (
    <Stack className="w-96">
      <DateRangeField value={range} invalid aria-label="Invalid" />
      <DateRangeField value={range} disabled aria-label="Disabled" />
      <DateRangeField value={range} readonly aria-label="Read only" />
      <DateRangeField value={range} variant="secondary" aria-label="Secondary" />
    </Stack>
  )
}
