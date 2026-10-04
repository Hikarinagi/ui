<script setup lang="ts">
  import { Card, Select, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Select :options="options" placeholder="直接放在页面上" aria-label="页面上的选择框" />
    <Card>
      <Select
        variant="secondary"
        :options="options"
        placeholder="放在卡片内"
        aria-label="卡片内的选择框"
      />
    </Card>
  </Stack>
</template>
