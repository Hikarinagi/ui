import { NumberInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-40">
      <NumberInput size="sm" defaultValue={1} aria-label="Small" />
      <NumberInput size="md" defaultValue={1} aria-label="Medium" />
      <NumberInput size="lg" defaultValue={1} aria-label="Large" />
    </Stack>
  )
}
