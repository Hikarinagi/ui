import { DateTimePicker, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80">
      <DateTimePicker size="sm" value="2026-09-04T20:00" aria-label="小号" />
      <DateTimePicker size="md" value="2026-09-04T20:00" aria-label="中号" />
      <DateTimePicker size="lg" value="2026-09-04T20:00" aria-label="大号" />
    </Stack>
  )
}
