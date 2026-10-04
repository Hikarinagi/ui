import { DateRangePicker, Stack } from '@hina-ui/react'

export default function Demo() {
  const range = { start: '2026-09-04', end: '2026-09-12' }
  return (
    <Stack className="w-96">
      <DateRangePicker size="sm" value={range} aria-label="小号" />
      <DateRangePicker size="md" value={range} aria-label="中号" />
      <DateRangePicker size="lg" value={range} aria-label="大号" />
    </Stack>
  )
}
