<script setup lang="ts">
  import { Button, Empty } from '@hina-ui/vue'
</script>

<template>
  <Empty title="No reviews yet" description="Finish a book, then write the first one." class="w-96">
    <template #actions>
      <Button size="sm">Write a review</Button>
    </template>
  </Empty>
</template>
