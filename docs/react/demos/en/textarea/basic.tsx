import { Textarea } from '@hina-ui/react'

export default function Demo() {
  return (
    <Textarea
      defaultValue=""
      aria-label="Comment"
      placeholder="Write a comment"
      className="w-full max-w-md"
    />
  )
}
