<script setup lang="ts">
  import { MessageSquare } from '@lucide/vue'
  import { Panel, Text } from '@hina-ui/vue'
</script>

<template>
  <Panel title="评论" :count="128" class="w-96">
    <template #icon><MessageSquare /></template>
    <Text>按时间倒序排列，最新的在前。</Text>
  </Panel>
</template>
