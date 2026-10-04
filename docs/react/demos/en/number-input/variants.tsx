import { NumberInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-xs">
      <NumberInput variant="primary" aria-label="primary" defaultValue={1} />
      <NumberInput variant="secondary" aria-label="secondary" defaultValue={1} />
      <NumberInput variant="bare" aria-label="bare" defaultValue={1} />
    </Stack>
  )
}
