<script setup lang="ts">
  import { Settings2 } from '@lucide/vue'
  import { Button, Heading, Input, Popover, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Popover align="start">
    <Button variant="outline" tone="neutral">
      <template #icon>
        <Settings2 />
      </template>
      Reading settings
    </Button>
    <template #content>
      <Stack gap="sm" class="w-60">
        <Stack gap="xs">
          <Heading :level="4" size="sm">Reading settings</Heading>
          <Text tone="muted" size="sm">Adjust the width and line height of the text.</Text>
        </Stack>
        <Stack gap="xs">
          <Text size="sm">Body width</Text>
          <Input model-value="720" size="sm" />
        </Stack>
        <Stack gap="xs">
          <Text size="sm">Line height</Text>
          <Input model-value="1.8" size="sm" />
        </Stack>
        <Button size="sm">Save</Button>
      </Stack>
    </template>
  </Popover>
</template>
