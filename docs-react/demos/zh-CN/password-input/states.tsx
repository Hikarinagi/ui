import { PasswordInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-64">
      <PasswordInput invalid defaultValue="123456" aria-label="校验未通过" />
      <PasswordInput disabled defaultValue="hoshimi" aria-label="已禁用" />
    </Stack>
  )
}
