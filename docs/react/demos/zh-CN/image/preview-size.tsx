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
          自动获取尺寸
        </Text>
        <Image
          src={image.thumbnail}
          preview={image.original}
          alt="夏日午后的坡道"
          ratio={16 / 9}
          className="rounded-xl"
        />
      </Stack>
      <Stack gap="sm" className="w-64">
        <Text size="sm" tone="muted">
          预先提供尺寸
        </Text>
        <Image
          src={image.thumbnail}
          preview={image.original}
          previewSize={{ width: image.width, height: image.height }}
          alt="夏日午后的坡道"
          ratio={16 / 9}
          className="rounded-xl"
        />
      </Stack>
    </Inline>
  )
}
