import { DateField, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <DateField value="2026-09-04" invalid aria-label="校验未通过" />
      <DateField value="2026-09-04" disabled aria-label="已禁用" />
      <DateField value="2026-09-04" readonly aria-label="只读" />
      <DateField value="2026-09-04" variant="secondary" aria-label="扁平形态" />
    </Stack>
  )
}
