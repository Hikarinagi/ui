<script setup lang="ts">
  import { DatePicker, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <DatePicker model-value="2026-09-04" invalid aria-label="校验未通过" />
    <DatePicker model-value="2026-09-04" disabled aria-label="已禁用" />
    <DatePicker model-value="2026-09-04" readonly aria-label="只读" />
    <DatePicker model-value="2026-09-04" variant="secondary" aria-label="扁平形态" />
  </Stack>
</template>
