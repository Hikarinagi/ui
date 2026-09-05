<script setup lang="ts">
  import { Stack, TimeField } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-40">
    <TimeField model-value="20:00" invalid aria-label="校验未通过" />
    <TimeField model-value="20:00" disabled aria-label="已禁用" />
    <TimeField model-value="20:00" readonly aria-label="只读" />
    <TimeField model-value="20:00" variant="secondary" aria-label="扁平形态" />
  </Stack>
</template>
