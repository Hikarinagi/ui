<script setup lang="ts">
  import { Button, Result } from '@hina-ui/vue'
</script>

<template>
  <Result
    status="success"
    title="Review published"
    description="Other readers can see it now."
    class="w-96"
  >
    <template #actions>
      <Button size="sm">View review</Button>
      <Button size="sm" variant="ghost" tone="neutral">Back to shelf</Button>
    </template>
  </Result>
</template>
