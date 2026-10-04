import { DateRangeField, Stack } from '@hina-ui/react'

export default function Demo() {
  const range = { start: '2026-09-01', end: '2026-09-30' }
  return (
    <Stack className="w-96">
      <DateRangeField value={range} invalid aria-label="校验未通过" />
      <DateRangeField value={range} disabled aria-label="已禁用" />
      <DateRangeField value={range} readonly aria-label="只读" />
      <DateRangeField value={range} variant="secondary" aria-label="扁平形态" />
    </Stack>
  )
}
