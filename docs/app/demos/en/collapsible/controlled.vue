<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Button,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    Inline,
    Stack,
    Text,
  } from '@hina-ui/vue'

  const open = ref(false)
</script>

<template>
  <Stack class="w-full max-w-md">
    <Inline>
      <Button size="sm" variant="soft" tone="neutral" @click="open = !open">
        {{ open ? 'Collapse' : 'Expand' }}
      </Button>
      <Text tone="muted" size="sm">open: {{ open }}</Text>
    </Inline>
    <Collapsible v-model:open="open">
      <Stack gap="sm" align="start">
        <CollapsibleTrigger>The component's own trigger</CollapsibleTrigger>
        <CollapsibleContent>
          <Text tone="muted" size="sm">Both triggers drive the same state.</Text>
        </CollapsibleContent>
      </Stack>
    </Collapsible>
  </Stack>
</template>
