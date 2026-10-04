'use client'

import {
  Image,
  ImageGroup,
  ImageResolverProvider,
  Inline,
  type ImageResolver,
} from '@hina-ui/react'

const resolver: ImageResolver = (src, variant) =>
  `https://imagesp.yurari.moe/${src}?w=${variant === 'preview' ? 2000 : 600}&f=webp&fit=scale-down&q=85`

const pictures = [
  { src: 'galgame/10509/y71oty0w_2.jpg', alt: '《宿星的女友 3》的截图', className: 'w-48' },
  {
    src: 'galgame/10003/orhsttk4_2.jpg',
    alt: '《抬头看看吧，看那天上的繁星》的封面',
    className: 'w-20',
  },
  { src: 'galgame/10012/co4a4kyg_2.png', alt: '《ONE.》的主视觉', className: 'w-20' },
  {
    src: 'images/1ec4bca1-0674-4da6-b1a2-7433f1d79df5.webp',
    alt: '《街角魔族》第一卷的封面',
    className: 'w-20',
  },
  {
    src: 'images/74b0eddb-819f-4ee8-b406-fa096943a5b9.webp',
    alt: '《抬头看看吧，看那天上的繁星 FINE DAYS》的封面',
    className: 'w-40',
  },
]

export default function Demo() {
  return (
    <ImageResolverProvider resolver={resolver}>
      <ImageGroup loop>
        <Inline>
          {pictures.map(picture => (
            <Image
              key={picture.src}
              src={picture.src}
              alt={picture.alt}
              preview
              className={`h-28 rounded-md ${picture.className}`}
            />
          ))}
        </Inline>
      </ImageGroup>
    </ImageResolverProvider>
  )
}
