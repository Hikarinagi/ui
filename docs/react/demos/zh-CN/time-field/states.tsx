import { Stack, TimeField } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-40">
      <TimeField value="20:00" invalid aria-label="校验未通过" />
      <TimeField value="20:00" disabled aria-label="已禁用" />
      <TimeField value="20:00" readonly aria-label="只读" />
      <TimeField value="20:00" variant="secondary" aria-label="扁平形态" />
    </Stack>
  )
}
