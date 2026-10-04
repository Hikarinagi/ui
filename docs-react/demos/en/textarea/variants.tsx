import { Textarea, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      <Textarea variant="primary" aria-label="primary" placeholder="primary" />
      <Textarea variant="secondary" aria-label="secondary" placeholder="secondary" />
      <Textarea variant="bare" aria-label="bare" placeholder="bare" />
    </Stack>
  )
}
