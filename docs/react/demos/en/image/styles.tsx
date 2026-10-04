import { Image } from '@hina-ui/react'

export default function Demo() {
  return (
    <Image
      src="/sample.webp"
      alt="A hillside on a summer afternoon"
      preview
      className="rounded-md"
      style={{ width: '240px', height: '160px' }}
      imageStyle={{ objectPosition: 'left center' }}
    />
  )
}
