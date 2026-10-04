import { DatePicker, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <DatePicker value="2026-09-04" invalid aria-label="Invalid" />
      <DatePicker value="2026-09-04" disabled aria-label="Disabled" />
      <DatePicker value="2026-09-04" readonly aria-label="Read only" />
      <DatePicker value="2026-09-04" variant="secondary" aria-label="Secondary" />
    </Stack>
  )
}
