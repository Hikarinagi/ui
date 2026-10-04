import { NumberInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-40">
      <NumberInput size="sm" defaultValue={1} aria-label="小号" />
      <NumberInput size="md" defaultValue={1} aria-label="中号" />
      <NumberInput size="lg" defaultValue={1} aria-label="大号" />
    </Stack>
  )
}
