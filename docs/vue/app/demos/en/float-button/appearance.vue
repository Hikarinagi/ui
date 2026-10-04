<script setup lang="ts">
  import { ref } from 'vue'
  import { HelpCircle, Pencil, Plus } from '@lucide/vue'
  import { FloatButton, Flex, Stack, Text } from '@hina-ui/vue'

  const result = ref('Hover or focus with the keyboard to see each action name')
</script>

<template>
  <Stack align="center" gap="lg">
    <Flex wrap justify="center" gap="lg">
      <FloatButton
        position="static"
        label="Create project"
        @click="result = 'Selected: Create project'"
      >
        <Plus />
      </FloatButton>
      <FloatButton
        position="static"
        label="Edit project"
        variant="soft"
        shape="square"
        @click="result = 'Selected: Edit project'"
      >
        <Pencil />
      </FloatButton>
      <FloatButton
        position="static"
        label="Help center"
        variant="outline"
        tone="neutral"
        @click="result = 'Selected: Help center'"
      >
        <HelpCircle />
      </FloatButton>
    </Flex>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
