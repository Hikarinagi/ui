import { Image } from '@hina-ui/react'

export default function Demo() {
  return (
    <Image
      src="/missing.webp"
      fallback="/sample.webp"
      alt="夏日午后的坡道"
      ratio={16 / 9}
      className="w-full max-w-md rounded-md"
    />
  )
}
