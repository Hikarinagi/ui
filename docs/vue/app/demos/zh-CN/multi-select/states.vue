<script setup lang="ts">
  import { MultiSelect, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'school', label: '校园' },
    { value: 'sf', label: '科幻' },
    { value: 'romance', label: '恋爱' },
  ]
</script>

<template>
  <Stack class="w-72">
    <MultiSelect
      invalid
      :options="options"
      placeholder="至少选择一个标签"
      aria-label="校验未通过"
    />
    <MultiSelect disabled :options="options" :model-value="['school']" aria-label="已禁用" />
  </Stack>
</template>
