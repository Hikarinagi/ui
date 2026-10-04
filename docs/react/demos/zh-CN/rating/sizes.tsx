import { Rating, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack align="start">
      <Rating value={3} size="sm" aria-label="小号" />
      <Rating value={3} size="md" aria-label="中号" />
      <Rating value={3} size="lg" aria-label="大号" />
    </Stack>
  )
}
