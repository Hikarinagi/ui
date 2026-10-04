import { Textarea } from '@hina-ui/react'

export default function Demo() {
  return (
    <Textarea
      defaultValue="On my first day at the new school I met a girl on the roof holding an old camera. She said it could photograph tomorrow."
      aria-label="Synopsis"
      autosize
      className="w-full max-w-md"
    />
  )
}
