import { PasswordInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-64">
      <PasswordInput size="sm" defaultValue="hoshimi" aria-label="Small" />
      <PasswordInput size="md" defaultValue="hoshimi" aria-label="Medium" />
      <PasswordInput size="lg" defaultValue="hoshimi" aria-label="Large" />
    </Stack>
  )
}
