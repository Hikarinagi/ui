<script setup lang="ts">
  import { Button, Empty, Panel } from '@hina-ui/vue'
</script>

<template>
  <Panel title="Recent activity" :count="0" class="w-96">
    <template #actions>
      <Button size="sm" variant="ghost" tone="neutral">All</Button>
    </template>
    <Empty
      size="sm"
      title="Nothing happened in the last seven days"
      description="Follow a few people and this will fill up."
    />
  </Panel>
</template>
