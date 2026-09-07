<script setup lang="ts">
  import { SearchX } from '@lucide/vue'
  import { Empty, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg" align="start">
    <Empty title="没有匹配的结果" description="换个关键词试试。" class="w-72">
      <template #icon><SearchX class="text-muted size-8" /></template>
    </Empty>
    <Empty title="没有匹配的结果" description="换个关键词试试。" :icon="false" class="w-72" />
  </Inline>
</template>
