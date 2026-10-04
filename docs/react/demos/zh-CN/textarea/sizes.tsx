import { Stack, Textarea } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      <Textarea size="sm" rows={1} aria-label="小号" placeholder="小号" />
      <Textarea size="md" rows={1} aria-label="中号" placeholder="中号" />
      <Textarea size="lg" rows={1} aria-label="大号" placeholder="大号" />
    </Stack>
  )
}
