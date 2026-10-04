import { DateRangeField, Stack } from '@hina-ui/react'

export default function Demo() {
  const range = { start: '2026-09-01', end: '2026-09-30' }
  return (
    <Stack className="w-96">
      <DateRangeField size="sm" value={range} aria-label="小号" />
      <DateRangeField size="md" value={range} aria-label="中号" />
      <DateRangeField size="lg" value={range} aria-label="大号" />
    </Stack>
  )
}
