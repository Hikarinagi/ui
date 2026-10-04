import { AspectRatio, Image } from '@hina-ui/react'

export default function Demo() {
  return (
    <AspectRatio className="bg-inset w-full max-w-md overflow-hidden rounded-md">
      <Image src="/sample.webp" alt="夏日午后的坡道" className="size-full" />
    </AspectRatio>
  )
}
