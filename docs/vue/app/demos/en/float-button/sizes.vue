<script setup lang="ts">
  import { ref } from 'vue'
  import { Plus } from '@lucide/vue'
  import { FloatButton, Flex, Stack, Text } from '@hina-ui/vue'

  const result = ref('Extended buttons keep the same height and grow to fit the label')
</script>

<template>
  <Stack align="center" gap="lg">
    <Flex wrap align="center" justify="center" gap="lg">
      <FloatButton
        v-for="size in ['sm', 'md', 'lg'] as const"
        :key="size"
        position="static"
        :size="size"
        :label="`Create project（${size}）`"
        @click="result = `Selected: ${size}`"
      >
        <Plus />
      </FloatButton>
      <FloatButton
        position="static"
        extended
        label="Create project"
        @click="result = 'Selected: Create project'"
      >
        <Plus />
      </FloatButton>
    </Flex>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
