<script setup lang="ts">
  import { DateField, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <DateField model-value="2026-09-04" invalid aria-label="校验未通过" />
    <DateField model-value="2026-09-04" disabled aria-label="已禁用" />
    <DateField model-value="2026-09-04" readonly aria-label="只读" />
    <DateField model-value="2026-09-04" variant="secondary" aria-label="扁平形态" />
  </Stack>
</template>
