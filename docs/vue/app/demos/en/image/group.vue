<script setup lang="ts">
  import { Image, ImageGroup, Inline, provideImageResolver } from '@hina-ui/vue'

  provideImageResolver(
    (src, variant) =>
      `https://imagesp.yurari.moe/${src}?w=${variant === 'preview' ? 2000 : 600}&f=webp&fit=scale-down&q=85`,
  )

  const pictures = [
    {
      src: 'galgame/10509/y71oty0w_2.jpg',
      alt: 'A screenshot of Shukusei no Girlfriend 3',
      class: 'w-48',
    },
    { src: 'galgame/10003/orhsttk4_2.jpg', alt: 'The cover of A Sky Full of Stars', class: 'w-20' },
    { src: 'galgame/10012/co4a4kyg_2.png', alt: 'The key visual of ONE.', class: 'w-20' },
    {
      src: 'images/1ec4bca1-0674-4da6-b1a2-7433f1d79df5.webp',
      alt: 'The cover of Machikado Mazoku volume 1',
      class: 'w-20',
    },
    {
      src: 'images/74b0eddb-819f-4ee8-b406-fa096943a5b9.webp',
      alt: 'The cover of A Sky Full of Stars FINE DAYS',
      class: 'w-40',
    },
  ]
</script>

<template>
  <ImageGroup loop>
    <Inline>
      <Image
        v-for="picture in pictures"
        :key="picture.src"
        :src="picture.src"
        :alt="picture.alt"
        preview
        :class="`h-28 rounded-md ${picture.class}`"
      />
    </Inline>
  </ImageGroup>
</template>
