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
  {
    src: 'galgame/10509/y71oty0w_2.jpg',
    alt: 'A screenshot of Shukusei no Girlfriend 3',
    className: 'w-48',
  },
  {
    src: 'galgame/10003/orhsttk4_2.jpg',
    alt: 'The cover of A Sky Full of Stars',
    className: 'w-20',
  },
  { src: 'galgame/10012/co4a4kyg_2.png', alt: 'The key visual of ONE.', className: 'w-20' },
  {
    src: 'images/1ec4bca1-0674-4da6-b1a2-7433f1d79df5.webp',
    alt: 'The cover of Machikado Mazoku volume 1',
    className: 'w-20',
  },
  {
    src: 'images/74b0eddb-819f-4ee8-b406-fa096943a5b9.webp',
    alt: 'The cover of A Sky Full of Stars FINE DAYS',
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
