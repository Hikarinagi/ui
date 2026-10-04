<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuLabel } from '@hina-ui/vue'

  const showCover = ref(true)
  const showSummary = ref(false)
  const showTags = ref(true)
</script>

<template>
  <DropdownMenu label="Columns">
    <Button variant="outline" tone="neutral">Columns</Button>
    <template #content>
      <DropdownMenuLabel>Show in list</DropdownMenuLabel>
      <DropdownMenuCheckboxItem v-model:checked="showCover">Cover</DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem v-model:checked="showSummary">Summary</DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem v-model:checked="showTags">Tags</DropdownMenuCheckboxItem>
    </template>
  </DropdownMenu>
</template>
