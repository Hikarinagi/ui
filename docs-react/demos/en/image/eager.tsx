import { Image } from '@hina-ui/react'

export default function Demo() {
  return (
    <Image
      src="/sample.webp"
      alt="A slope on a summer afternoon"
      lazy={false}
      eager
      ratio={16 / 9}
      className="w-full max-w-md rounded-md"
    />
  )
}
