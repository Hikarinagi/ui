<script setup lang="ts">
  import { DateTimePicker, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-80">
    <DateTimePicker model-value="2026-09-04T20:00" invalid aria-label="校验未通过" />
    <DateTimePicker model-value="2026-09-04T20:00" disabled aria-label="已禁用" />
    <DateTimePicker model-value="2026-09-04T20:00" readonly aria-label="只读" />
    <DateTimePicker model-value="2026-09-04T20:00" variant="secondary" aria-label="扁平形态" />
  </Stack>
</template>
