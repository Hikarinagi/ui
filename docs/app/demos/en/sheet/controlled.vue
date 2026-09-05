<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Sheet, Text } from '@hina-ui/vue'

  const open = ref(false)
</script>

<template>
  <Inline gap="sm">
    <Button variant="outline" tone="neutral" @click="open = true">Open from outside</Button>
    <Sheet v-model:open="open" title="Saved" description="This article is now in your collection.">
      <template #content>
        <Text>A sheet without a trigger, opened by the button outside.</Text>
      </template>
      <template #footer="{ close }">
        <Button @click="close">Got it</Button>
      </template>
    </Sheet>
  </Inline>
</template>
