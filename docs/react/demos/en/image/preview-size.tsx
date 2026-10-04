import { Image, Inline, Stack, Text } from '@hina-ui/react'

const image = {
  thumbnail: '/sample-thumbnail.webp',
  original: '/sample.webp',
  width: 1200,
  height: 675,
}

export default function Demo() {
  return (
    <Inline align="start" className="gap-6">
      <Stack gap="sm" className="w-64">
        <Text size="sm" tone="muted">
          Detect dimensions
        </Text>
        <Image
          src={image.thumbnail}
          preview={image.original}
          alt="A hillside on a summer afternoon"
          ratio={16 / 9}
          className="rounded-xl"
        />
      </Stack>
      <Stack gap="sm" className="w-64">
        <Text size="sm" tone="muted">
          Known dimensions
        </Text>
        <Image
          src={image.thumbnail}
          preview={image.original}
          previewSize={{ width: image.width, height: image.height }}
          alt="A hillside on a summer afternoon"
          ratio={16 / 9}
          className="rounded-xl"
        />
      </Stack>
    </Inline>
  )
}
