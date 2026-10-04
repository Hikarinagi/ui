import { DateRangePicker, Stack } from '@hina-ui/react'

export default function Demo() {
  const range = { start: '2026-09-04', end: '2026-09-12' }
  return (
    <Stack className="w-96">
      <DateRangePicker value={range} invalid aria-label="校验未通过" />
      <DateRangePicker value={range} disabled aria-label="已禁用" />
      <DateRangePicker value={range} readonly aria-label="只读" />
      <DateRangePicker value={range} variant="secondary" aria-label="扁平形态" />
    </Stack>
  )
}
