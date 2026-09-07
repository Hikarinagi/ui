<script setup lang="ts">
  import { Button, Empty, Panel } from '@hina-ui/vue'
</script>

<template>
  <Panel title="最近活动" :count="0" class="w-96">
    <template #actions>
      <Button size="sm" variant="ghost" tone="neutral">全部</Button>
    </template>
    <Empty size="sm" title="过去七天没有动态" description="关注一些人，这里就会热闹起来。" />
  </Panel>
</template>
