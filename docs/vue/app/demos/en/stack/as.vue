<script setup lang="ts">
  import { Card, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack as="ul" gap="sm" class="w-full max-w-xs">
    <Card as="li">Items render as li</Card>
    <Card as="li">The container renders as ul</Card>
  </Stack>
</template>
