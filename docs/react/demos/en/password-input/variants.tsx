import { PasswordInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-xs">
      <PasswordInput variant="primary" aria-label="primary" defaultValue="hoshimi" />
      <PasswordInput variant="secondary" aria-label="secondary" defaultValue="hoshimi" />
      <PasswordInput variant="bare" aria-label="bare" defaultValue="hoshimi" />
    </Stack>
  )
}
