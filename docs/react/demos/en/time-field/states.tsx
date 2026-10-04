import { Stack, TimeField } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-40">
      <TimeField value="20:00" invalid aria-label="Invalid" />
      <TimeField value="20:00" disabled aria-label="Disabled" />
      <TimeField value="20:00" readonly aria-label="Read only" />
      <TimeField value="20:00" variant="secondary" aria-label="Secondary" />
    </Stack>
  )
}
