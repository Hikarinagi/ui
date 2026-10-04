import { Stack, TimeField } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-40">
      <TimeField size="sm" value="20:00" aria-label="Small" />
      <TimeField size="md" value="20:00" aria-label="Medium" />
      <TimeField size="lg" value="20:00" aria-label="Large" />
    </Stack>
  )
}
