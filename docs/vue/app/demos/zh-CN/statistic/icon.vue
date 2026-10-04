<script setup lang="ts">
  import { Bookmark, MessageSquare } from '@lucide/vue'
  import { Card, Inline, Statistic } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="md" align="stretch">
    <Card class="w-56">
      <Statistic label="收藏" :value="318">
        <template #icon><Bookmark /></template>
      </Statistic>
    </Card>
    <Card class="w-56">
      <Statistic label="评论" :value="1024">
        <template #icon><MessageSquare /></template>
      </Statistic>
    </Card>
  </Inline>
</template>
