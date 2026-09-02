<script setup lang="ts">
  import { Image, provideImageResolver } from '@hina-ui/vue'

  provideImageResolver(
    (src, variant) =>
      `https://imagesp.yurari.moe/${src}?w=${variant === 'preview' ? 2000 : 600}&f=webp&fit=scale-down&q=85`,
  )
</script>

<template>
  <Image
    src="images/1ec4bca1-0674-4da6-b1a2-7433f1d79df5.webp"
    alt="The cover of Machikado Mazoku volume 1"
    preview
    class="size-48 rounded-md"
  />
</template>
