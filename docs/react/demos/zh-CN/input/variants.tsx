import { Input, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-xs">
      <Input variant="primary" aria-label="primary" placeholder="primary" />
      <Input variant="secondary" aria-label="secondary" placeholder="secondary" />
      <Input variant="bare" aria-label="bare" placeholder="bare" />
    </Stack>
  )
}
