import { PasswordInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-64">
      <PasswordInput invalid defaultValue="123456" aria-label="Invalid" />
      <PasswordInput disabled defaultValue="hoshimi" aria-label="Disabled" />
    </Stack>
  )
}
