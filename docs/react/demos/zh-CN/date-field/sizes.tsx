import { DateField, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <DateField size="sm" value="2026-09-04" aria-label="小号" />
      <DateField size="md" value="2026-09-04" aria-label="中号" />
      <DateField size="lg" value="2026-09-04" aria-label="大号" />
    </Stack>
  )
}
