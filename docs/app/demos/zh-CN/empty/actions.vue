<script setup lang="ts">
  import { Button, Empty } from '@hina-ui/vue'
</script>

<template>
  <Empty title="还没有书单" description="把想一起读的书收进一份书单。" class="w-96">
    <template #actions>
      <Button size="sm">新建书单</Button>
      <Button size="sm" variant="ghost" tone="neutral">了解书单</Button>
    </template>
  </Empty>
</template>
