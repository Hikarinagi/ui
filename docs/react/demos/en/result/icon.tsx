import { Button, Image, Result } from '@hina-ui/react'

export default function Demo() {
  return (
    <Result
      title="Today's goal reached"
      description="Seven days in a row of thirty minutes."
      className="w-96"
      icon={<Image src="/avatars/hug.webp" ratio={1} className="size-24 rounded-full" />}
      actions={<Button size="sm">Keep reading</Button>}
    />
  )
}
