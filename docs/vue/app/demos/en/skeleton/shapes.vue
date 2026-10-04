<script setup lang="ts">
  import { Card, Inline, Skeleton, Stack } from '@hina-ui/vue'
</script>

<template>
  <Card class="w-full max-w-sm">
    <Stack gap="sm">
      <Skeleton class="h-32 w-full rounded-lg" />
      <Inline gap="sm" align="center">
        <Skeleton class="size-10 rounded-full" />
        <Stack gap="xs" class="flex-1">
          <Skeleton class="h-4 w-1/2" />
          <Skeleton class="h-3 w-1/3" />
        </Stack>
      </Inline>
    </Stack>
  </Card>
</template>
