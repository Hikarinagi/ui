<script setup lang="ts">
  import { Stack, Textarea } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Textarea size="sm" :rows="1" aria-label="Small" placeholder="Small" />
    <Textarea size="md" :rows="1" aria-label="Medium" placeholder="Medium" />
    <Textarea size="lg" :rows="1" aria-label="Large" placeholder="Large" />
  </Stack>
</template>
