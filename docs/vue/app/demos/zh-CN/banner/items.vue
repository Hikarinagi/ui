<script setup lang="ts">
  import { Sparkles } from '@lucide/vue'
  import { Banner, Link, type BannerNotice } from '@hina-ui/vue'

  const notices: (BannerNotice & { text: string; link?: string })[] = [
    { text: 'Hina UI 1.2 已发布。', link: '查看更新说明' },
    { text: '本站将于 3 月 1 日 02:00 至 04:00 停机维护。', tone: 'warning' },
    { text: '周年活动进行中，全站图书限时八折。', link: '了解详情', icon: Sparkles },
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
