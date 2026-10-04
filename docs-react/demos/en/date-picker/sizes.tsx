import { DatePicker, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <DatePicker size="sm" value="2026-09-04" aria-label="Small" />
      <DatePicker size="md" value="2026-09-04" aria-label="Medium" />
      <DatePicker size="lg" value="2026-09-04" aria-label="Large" />
    </Stack>
  )
}
