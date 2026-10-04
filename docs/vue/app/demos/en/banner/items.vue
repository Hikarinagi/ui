<script setup lang="ts">
  import { Sparkles } from '@lucide/vue'
  import { Banner, Link, type BannerNotice } from '@hina-ui/vue'

  const notices: (BannerNotice & { text: string; link?: string })[] = [
    { text: 'Hina UI 1.2 is out.', link: 'Read the release notes' },
    { text: 'The site will be down for maintenance on 1 March, 02:00 to 04:00.', tone: 'warning' },
    {
      text: 'Anniversary sale: 20% off every book for a limited time.',
      link: 'Learn more',
      icon: Sparkles,
    },
  ]
</script>

<template>
  <Banner :items="notices" closable>
    <template #item="{ item }">
      {{ item.text }}
      <Link v-if="item.link" href="#" underline>{{ item.link }}</Link>
    </template>
  </Banner>
</template>
