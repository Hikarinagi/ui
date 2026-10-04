import { DatePicker, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <DatePicker size="sm" value="2026-09-04" aria-label="小号" />
      <DatePicker size="md" value="2026-09-04" aria-label="中号" />
      <DatePicker size="lg" value="2026-09-04" aria-label="大号" />
    </Stack>
  )
}
