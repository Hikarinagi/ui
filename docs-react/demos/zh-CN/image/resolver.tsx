'use client'

import { Image, ImageResolverProvider, Stack, Text, type ImageResolver } from '@hina-ui/react'

const resolver: ImageResolver = src => `${src}?preset=banner&quality=82`

export default function Demo() {
  return (
    <ImageResolverProvider resolver={resolver}>
      <Stack className="w-full max-w-md">
        <Image src="/sample.webp" alt="夏日午后的坡道" ratio={16 / 9} className="rounded-md" />
        <Text tone="muted" size="sm">
          这里的解析器为地址补充查询串，真实应用会将地址指向 CDN 与图片处理服务。
        </Text>
      </Stack>
    </ImageResolverProvider>
  )
}
