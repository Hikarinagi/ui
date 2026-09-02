<script setup lang="ts">
  import { Alert, Button } from '@hikarinagi/ui'
</script>

<template>
  <Alert tone="info" title="New comments" class="w-full max-w-xl">
    Your article has received 3 new comments.
    <template #actions>
      <Button size="sm" variant="soft" tone="neutral">Later</Button>
      <Button size="sm">View</Button>
    </template>
  </Alert>
</template>
