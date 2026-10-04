<script setup lang="ts">
  import { Card, MultiSelect, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'school', label: '校园' },
    { value: 'sf', label: '科幻' },
  ]
</script>

<template>
  <Stack class="w-72">
    <MultiSelect :options="options" placeholder="直接放在页面上" aria-label="页面上的多选框" />
    <Card>
      <MultiSelect
        variant="secondary"
        :options="options"
        placeholder="放在卡片内"
        aria-label="卡片内的多选框"
      />
    </Card>
  </Stack>
</template>
