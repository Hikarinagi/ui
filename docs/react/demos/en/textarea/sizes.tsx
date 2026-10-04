import { Stack, Textarea } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      <Textarea size="sm" rows={1} aria-label="Small" placeholder="Small" />
      <Textarea size="md" rows={1} aria-label="Medium" placeholder="Medium" />
      <Textarea size="lg" rows={1} aria-label="Large" placeholder="Large" />
    </Stack>
  )
}
