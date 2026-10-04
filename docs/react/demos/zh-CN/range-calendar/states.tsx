import { RangeCalendar, Inline } from '@hina-ui/react'

const range = { start: '2026-09-04', end: '2026-09-12' }

export default function Demo() {
  return (
    <Inline gap="lg" align="start">
      <RangeCalendar defaultValue={range} readonly />
      <RangeCalendar defaultValue={range} disabled />
    </Inline>
  )
}
