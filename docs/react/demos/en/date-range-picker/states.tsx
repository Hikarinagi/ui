import { DateRangePicker, Stack } from '@hina-ui/react'

export default function Demo() {
  const range = { start: '2026-09-04', end: '2026-09-12' }
  return (
    <Stack className="w-96">
      <DateRangePicker value={range} invalid aria-label="Invalid" />
      <DateRangePicker value={range} disabled aria-label="Disabled" />
      <DateRangePicker value={range} readonly aria-label="Read only" />
      <DateRangePicker value={range} variant="secondary" aria-label="Secondary" />
    </Stack>
  )
}
