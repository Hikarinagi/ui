<script setup lang="ts">
  import { Inline, Spinner, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="sm" align="center">
    <Spinner size="sm" label="正在提交评价" />
    <Text size="sm" tone="muted">正在提交评价……</Text>
  </Inline>
</template>
