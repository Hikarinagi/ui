import { AspectRatio, Image } from '@hina-ui/react'

export default function Demo() {
  return (
    <AspectRatio className="bg-inset w-full max-w-md overflow-hidden rounded-md">
      <Image src="/sample.webp" alt="A slope on a summer afternoon" className="size-full" />
    </AspectRatio>
  )
}
