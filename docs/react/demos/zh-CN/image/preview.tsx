'use client'

import { Image, ImageResolverProvider, type ImageResolver } from '@hina-ui/react'

const resolver: ImageResolver = (src, variant) =>
  `https://imagesp.yurari.moe/${src}?w=${variant === 'preview' ? 2000 : 600}&f=webp&fit=scale-down&q=85`

export default function Demo() {
  return (
    <ImageResolverProvider resolver={resolver}>
      <Image
        src="images/1ec4bca1-0674-4da6-b1a2-7433f1d79df5.webp"
        alt="《街角魔族》第一卷的封面"
        preview
        className="size-48 rounded-md"
      />
    </ImageResolverProvider>
  )
}
