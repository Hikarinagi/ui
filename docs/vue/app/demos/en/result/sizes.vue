<script setup lang="ts">
  import { Result, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="lg" class="w-96">
    <Result status="success" size="sm" title="Saved" description="Your changes are live." />
    <Result status="success" title="Saved" description="Your changes are live." />
    <Result status="success" size="lg" title="Saved" description="Your changes are live." />
  </Stack>
</template>
