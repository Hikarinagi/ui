import { NumberInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-40">
      <NumberInput defaultValue={2.5} min={0} max={10} step={0.5} aria-label="Rating" />
      <NumberInput defaultValue={12} min={1} step={5} stepSnapping={false} aria-label="Pages" />
    </Stack>
  )
}
