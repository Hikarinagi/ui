<script setup lang="ts">
  import { ref } from 'vue'
  import { Clock, FilePen, Send } from '@lucide/vue'
  import { DropdownMenuItem, SplitButton, Stack, Text } from '@hina-ui/vue'

  const result = ref('Article ready to publish')
</script>

<template>
  <Stack align="center" gap="sm">
    <SplitButton
      label="Article actions"
      menu-label="More publishing options"
      @click="result = 'Action: publish now'"
    >
      <template #icon><Send /></template>
      Publish now
      <template #content>
        <DropdownMenuItem @select="result = 'Action: save draft'">
          <template #icon><FilePen /></template>
          Save draft
        </DropdownMenuItem>
        <DropdownMenuItem @select="result = 'Action: schedule'">
          <template #icon><Clock /></template>
          Schedule
        </DropdownMenuItem>
      </template>
    </SplitButton>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
