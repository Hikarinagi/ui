<script setup lang="ts">
  import { ref } from 'vue'
  import { Center, ContextMenu, ContextMenuCheckboxItem, Text } from '@hina-ui/vue'

  const grid = ref(true)
  const ruler = ref(false)
</script>

<template>
  <ContextMenu label="View">
    <Center class="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
      <Text tone="muted" size="sm">
        Grid {{ grid ? 'on' : 'off' }}, ruler {{ ruler ? 'on' : 'off' }}
      </Text>
    </Center>
    <template #content>
      <ContextMenuCheckboxItem v-model:checked="grid">Show grid</ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem v-model:checked="ruler">Show ruler</ContextMenuCheckboxItem>
    </template>
  </ContextMenu>
</template>
