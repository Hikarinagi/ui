import { Image, ImageGroup, Inline, Stack, Text } from '@hina-ui/react'

const pictures = [
  { src: '/favicon.png', alt: 'Hina UI', size: '128 × 128' },
  { src: '/avatars/huh.webp', alt: '角色头像', size: '256 × 256' },
  { src: '/sample.webp', alt: '夏日午后的坡道', size: '1200 × 675' },
]

export default function Demo() {
  return (
    <ImageGroup>
      <Inline align="start" className="gap-6">
        {pictures.map(picture => (
          <Stack key={picture.src} gap="xs" className="w-32">
            <Image
              src={picture.src}
              alt={picture.alt}
              preview
              fit="contain"
              className="h-24 rounded-md"
            />
            <Text tone="muted" size="sm">
              {picture.size}
            </Text>
          </Stack>
        ))}
      </Inline>
    </ImageGroup>
  )
}
