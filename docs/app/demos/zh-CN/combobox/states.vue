<script setup lang="ts">
  import { Combobox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
    { value: 'manga', label: '漫画', disabled: true },
  ]
</script>

<template>
  <Stack class="w-64">
    <Combobox invalid :options="options" placeholder="请选择类型" aria-label="校验未通过" />
    <Combobox disabled :options="options" model-value="gal" aria-label="已禁用" />
  </Stack>
</template>
