import { DatePicker, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <DatePicker value="2026-09-04" invalid aria-label="校验未通过" />
      <DatePicker value="2026-09-04" disabled aria-label="已禁用" />
      <DatePicker value="2026-09-04" readonly aria-label="只读" />
      <DatePicker value="2026-09-04" variant="secondary" aria-label="扁平形态" />
    </Stack>
  )
}
