import { Textarea } from '@hina-ui/react'

export default function Demo() {
  return (
    <Textarea
      defaultValue=""
      aria-label="评论"
      placeholder="输入评论"
      className="w-full max-w-md"
    />
  )
}
