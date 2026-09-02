<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, DisclosureIcon, Inline, Text } from '@hikarinagi/ui'

  const open = ref(false)
</script>

<template>
  <Inline>
    <Button variant="soft" tone="neutral" @click="open = !open">
      <template #trailing>
        <DisclosureIcon :open="open" />
      </template>
      State held outside
    </Button>
    <Text tone="muted" size="sm">open: {{ open }}</Text>
  </Inline>
</template>
