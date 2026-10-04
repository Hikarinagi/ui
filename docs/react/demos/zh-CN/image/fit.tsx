import { Image, Inline, Stack, Text } from '@hina-ui/react'

const fits = ['cover', 'contain', 'fill'] as const

export default function Demo() {
  return (
    <Inline align="start" className="gap-4">
      {fits.map(fit => (
        <Stack key={fit} gap="xs" className="w-32">
          <Text tone="muted" size="sm">
            {fit}
          </Text>
          <Image
            src="/sample.webp"
            alt="夏日午后的坡道"
            fit={fit}
            ratio={1}
            className="bg-inset rounded-md"
          />
        </Stack>
      ))}
    </Inline>
  )
}
