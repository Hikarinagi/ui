<script setup lang="ts">
  import { Textarea, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Textarea variant="primary" aria-label="primary" placeholder="primary" />
    <Textarea variant="secondary" aria-label="secondary" placeholder="secondary" />
    <Textarea variant="bare" aria-label="bare" placeholder="bare" />
  </Stack>
</template>
