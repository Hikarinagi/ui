<script setup lang="ts">
  import { CheckboxGroup, Inline } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
    { value: 'manga', label: '漫画', disabled: true },
  ]
</script>

<template>
  <Inline gap="lg" align="start">
    <CheckboxGroup :options="options" :model-value="['gal']" aria-label="含禁用项" />
    <CheckboxGroup disabled :options="options" :model-value="['gal']" aria-label="整组禁用" />
    <CheckboxGroup invalid :options="options" :model-value="[]" aria-label="校验未通过" />
  </Inline>
</template>
