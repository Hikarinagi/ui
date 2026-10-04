import { Stack, TimeField } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-40">
      <TimeField size="sm" value="20:00" aria-label="小号" />
      <TimeField size="md" value="20:00" aria-label="中号" />
      <TimeField size="lg" value="20:00" aria-label="大号" />
    </Stack>
  )
}
