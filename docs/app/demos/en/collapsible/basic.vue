<script setup lang="ts">
  import { Collapsible, CollapsibleContent, CollapsibleTrigger, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Collapsible class="w-full max-w-md">
    <Stack gap="sm" align="start">
      <CollapsibleTrigger>Reading settings</CollapsibleTrigger>
      <CollapsibleContent>
        <Text tone="muted" size="sm">
          Type size, line height, page direction and background colour all live here.
        </Text>
      </CollapsibleContent>
    </Stack>
  </Collapsible>
</template>
