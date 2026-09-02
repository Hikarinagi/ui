<script setup lang="ts">
  import { Card, Listbox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Listbox :options="options" model-value="gal" aria-label="页面上的列表框" />
    <Card>
      <Listbox
        variant="secondary"
        :options="options"
        model-value="gal"
        aria-label="卡片内的列表框"
      />
    </Card>
  </Stack>
</template>
