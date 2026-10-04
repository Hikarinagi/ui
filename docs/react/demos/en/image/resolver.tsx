'use client'

import { Image, ImageResolverProvider, Stack, Text, type ImageResolver } from '@hina-ui/react'

const resolver: ImageResolver = src => `${src}?preset=banner&quality=82`

export default function Demo() {
  return (
    <ImageResolverProvider resolver={resolver}>
      <Stack className="w-full max-w-md">
        <Image
          src="/sample.webp"
          alt="A slope on a summer afternoon"
          ratio={16 / 9}
          className="rounded-md"
        />
        <Text tone="muted" size="sm">
          The resolver above appends a query string; a real application would point the address at a
          CDN and an image processor instead.
        </Text>
      </Stack>
    </ImageResolverProvider>
  )
}
