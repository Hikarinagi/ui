<script setup lang="ts">
  import { Progress, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="lg" class="w-80">
    <Progress :value="70" />
    <Progress :value="70" tone="neutral" />
    <Progress :value="100" tone="success" />
    <Progress :value="70" tone="warning" />
    <Progress :value="70" tone="danger" />
    <Progress :value="70" tone="info" />
  </Stack>
</template>
