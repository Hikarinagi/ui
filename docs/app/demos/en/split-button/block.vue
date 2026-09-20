<script setup lang="ts">
  import { ref } from 'vue'
  import { Download } from '@lucide/vue'
  import { DropdownMenuItem, SplitButton, Stack, Text } from '@hina-ui/vue'

  const result = ref('The primary action grows; the menu button stays square')
</script>

<template>
  <Stack class="w-full max-w-xs" gap="sm">
    <SplitButton
      block
      menu-label="More report actions"
      @click="result = 'Action: export the full report'"
    >
      <template #icon><Download /></template>
      Export the complete monthly activity report for all projects
      <template #content>
        <DropdownMenuItem @select="result = 'Action: export selection'">
          Export selection
        </DropdownMenuItem>
        <DropdownMenuItem @select="result = 'Action: copy report link'">
          Copy report link
        </DropdownMenuItem>
      </template>
    </SplitButton>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
