import { DateTimePicker, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80">
      <DateTimePicker value="2026-09-04T20:00" invalid aria-label="校验未通过" />
      <DateTimePicker value="2026-09-04T20:00" disabled aria-label="已禁用" />
      <DateTimePicker value="2026-09-04T20:00" readonly aria-label="只读" />
      <DateTimePicker value="2026-09-04T20:00" variant="secondary" aria-label="扁平形态" />
    </Stack>
  )
}
