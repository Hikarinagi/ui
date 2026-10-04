import { Rating, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack align="start">
      <Rating value={3} size="sm" aria-label="Small" />
      <Rating value={3} size="md" aria-label="Medium" />
      <Rating value={3} size="lg" aria-label="Large" />
    </Stack>
  )
}
