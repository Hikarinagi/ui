import { DateRangeField, Stack } from '@hina-ui/react'

export default function Demo() {
  const range = { start: '2026-09-01', end: '2026-09-30' }
  return (
    <Stack className="w-96">
      <DateRangeField size="sm" value={range} aria-label="Small" />
      <DateRangeField size="md" value={range} aria-label="Medium" />
      <DateRangeField size="lg" value={range} aria-label="Large" />
    </Stack>
  )
}
