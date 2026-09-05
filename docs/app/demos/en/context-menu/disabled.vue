<script setup lang="ts">
  import { ref } from 'vue'
  import { Center, ContextMenu, ContextMenuItem, Stack, Switch, Text } from '@hina-ui/vue'

  const locked = ref(false)
</script>

<template>
  <Stack gap="md" align="start">
    <Switch v-model="locked">Lock the area</Switch>
    <ContextMenu label="Item actions" :disabled="locked">
      <Center class="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
        <Text tone="muted" size="sm">
          {{ locked ? "Locked; right-click shows the browser's own menu" : 'Right-click here' }}
        </Text>
      </Center>
      <template #content>
        <ContextMenuItem>Edit</ContextMenuItem>
        <ContextMenuItem disabled>Move</ContextMenuItem>
        <ContextMenuItem tone="danger">Delete</ContextMenuItem>
      </template>
    </ContextMenu>
  </Stack>
</template>
