<script setup lang="ts">
  import { Skeleton, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <Skeleton class="h-4 w-1/3" />
    <Skeleton class="h-4 w-full" />
    <Skeleton class="h-4 w-4/5" />
  </Stack>
</template>
