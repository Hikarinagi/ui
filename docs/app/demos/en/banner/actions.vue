<script setup lang="ts">
  import { Banner, Button } from '@hina-ui/vue'
</script>

<template>
  <Banner tone="warning">
    Your session expires in 5 minutes.
    <template #actions>
      <Button size="sm" tone="neutral">Stay signed in</Button>
    </template>
  </Banner>
</template>
