<script setup lang="ts">
  import { Inline, Spinner, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm">
    <Inline gap="md" align="center">
      <Spinner />
      <Spinner class="text-accent" />
      <Spinner class="text-muted" />
    </Inline>
    <Text size="sm" tone="faint">环取自当前文字色，跟随所在容器。</Text>
  </Stack>
</template>
