<script setup lang="ts">
  import { Button, Empty } from '@hina-ui/vue'
</script>

<template>
  <Empty title="还没有书评" description="读完一本书之后，来写第一篇。" class="w-96">
    <template #actions>
      <Button size="sm">写书评</Button>
    </template>
  </Empty>
</template>
