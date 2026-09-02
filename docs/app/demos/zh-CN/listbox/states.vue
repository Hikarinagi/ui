<script setup lang="ts">
  import { Listbox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
    { value: 'manga', label: '漫画', disabled: true },
  ]
</script>

<template>
  <Stack class="w-56">
    <Listbox :options="options" model-value="gal" aria-label="含禁用项" />
    <Listbox disabled :options="options" model-value="gal" aria-label="已禁用" />
  </Stack>
</template>
