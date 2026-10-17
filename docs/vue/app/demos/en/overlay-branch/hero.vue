<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Card, Drawer, OverlayBranch, Text } from '@hina-ui/vue'

  const open = ref(false)
  const count = ref(0)
</script>

<template>
  <Drawer v-model:open="open" title="Reading settings">
    <Button variant="outline" tone="neutral">Open drawer</Button>
    <template #content>
      <Text tone="muted">
        The card in the bottom corner is outside the drawer. Pressing its button leaves the drawer
        open.
      </Text>
    </template>
  </Drawer>
  <OverlayBranch v-if="open" class="fixed start-4 bottom-4 z-[calc(var(--hn-z-overlay)+1)] w-56">
    <Card class="flex flex-col gap-2 p-3 shadow-lg">
      <Text size="sm" tone="muted">Outside layer</Text>
      <Button size="sm" @click="count++">Clicked {{ count }} times</Button>
    </Card>
  </OverlayBranch>
</template>
