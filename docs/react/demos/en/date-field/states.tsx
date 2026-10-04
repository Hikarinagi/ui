import { DateField, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <DateField value="2026-09-04" invalid aria-label="Invalid" />
      <DateField value="2026-09-04" disabled aria-label="Disabled" />
      <DateField value="2026-09-04" readonly aria-label="Read only" />
      <DateField value="2026-09-04" variant="secondary" aria-label="Secondary" />
    </Stack>
  )
}
