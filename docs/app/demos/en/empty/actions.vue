<script setup lang="ts">
  import { Button, Empty } from '@hina-ui/vue'
</script>

<template>
  <Empty
    title="No lists yet"
    description="Gather the books you want to read together."
    class="w-96"
  >
    <template #actions>
      <Button size="sm">New list</Button>
      <Button size="sm" variant="ghost" tone="neutral">About lists</Button>
    </template>
  </Empty>
</template>
