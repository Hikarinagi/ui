import { PasswordInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-64">
      <PasswordInput size="sm" defaultValue="hoshimi" aria-label="小号" />
      <PasswordInput size="md" defaultValue="hoshimi" aria-label="中号" />
      <PasswordInput size="lg" defaultValue="hoshimi" aria-label="大号" />
    </Stack>
  )
}
