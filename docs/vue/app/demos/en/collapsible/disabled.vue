<script setup lang="ts">
  import { Collapsible, CollapsibleContent, CollapsibleTrigger, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Collapsible disabled class="w-full max-w-md">
    <Stack gap="sm" align="start">
      <CollapsibleTrigger>Edit history (sign in required)</CollapsibleTrigger>
      <CollapsibleContent>
        <Text tone="muted" size="sm">This section will not open.</Text>
      </CollapsibleContent>
    </Stack>
  </Collapsible>
</template>
