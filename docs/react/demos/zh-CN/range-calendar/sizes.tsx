import { RangeCalendar, Stack } from '@hina-ui/react'

const range = { start: '2026-09-04', end: '2026-09-12' }

export default function Demo() {
  return (
    <Stack gap="lg" align="start">
      <RangeCalendar size="sm" defaultValue={range} />
      <RangeCalendar size="md" defaultValue={range} />
      <RangeCalendar size="lg" defaultValue={range} />
    </Stack>
  )
}
