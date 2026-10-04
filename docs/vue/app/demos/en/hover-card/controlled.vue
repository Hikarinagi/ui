<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, HoverCard, Inline, Link, Text } from '@hina-ui/vue'

  const open = ref(false)
</script>

<template>
  <Inline gap="lg" align="center">
    <Button variant="outline" tone="neutral" :disabled="open" @click="open = true">
      Open the card
    </Button>
    <HoverCard v-model:open="open">
      <Link href="#">Preview</Link>
      <template #content>
        <Text size="sm">
          Opened from outside; moving the pointer away, clicking outside or pressing Esc closes it.
        </Text>
      </template>
    </HoverCard>
    <Text tone="muted" size="sm">{{ open ? 'Open' : 'Closed' }}</Text>
  </Inline>
</template>
