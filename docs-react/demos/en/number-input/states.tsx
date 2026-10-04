import { NumberInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-40">
      <NumberInput invalid defaultValue={120} max={99} aria-label="Invalid" />
      <NumberInput disabled defaultValue={3} aria-label="Disabled" />
      <NumberInput readonly defaultValue={3} aria-label="Read-only" />
    </Stack>
  )
}
