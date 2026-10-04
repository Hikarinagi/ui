import { Stack, Textarea } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      <Textarea invalid aria-label="校验未通过" defaultValue="简介不能少于二十个字。" />
      <Textarea disabled aria-label="已禁用" defaultValue="审核期间不能修改简介。" />
    </Stack>
  )
}
