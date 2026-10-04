import { Button, Empty } from '@hina-ui/react'

export default function Demo() {
  return (
    <Empty
      title="No reviews yet"
      description="Finish a book, then write the first one."
      className="w-96"
      actions={<Button size="sm">Write a review</Button>}
    />
  )
}
