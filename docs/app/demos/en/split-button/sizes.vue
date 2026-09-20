<script setup lang="ts">
  import { ref } from 'vue'
  import { DropdownMenuItem, Flex, SplitButton, Stack, Text } from '@hina-ui/vue'

  const sizes = ['sm', 'md', 'lg'] as const
  const result = ref('Both buttons share the same height')
</script>

<template>
  <Stack align="center">
    <Flex wrap align="center" justify="center" gap="lg">
      <SplitButton
        v-for="size in sizes"
        :key="size"
        :size="size"
        :menu-label="`${size} options`"
        @click="result = `${size}: saved`"
      >
        Save
        <template #content>
          <DropdownMenuItem @select="result = `${size}: save a copy`">Save a copy</DropdownMenuItem>
        </template>
      </SplitButton>
      <SplitButton
        pill
        variant="outline"
        menu-label="Rounded button options"
        @click="result = 'Action: save'"
      >
        Rounded
        <template #content>
          <DropdownMenuItem @select="result = 'Action: save a copy'">Save a copy</DropdownMenuItem>
        </template>
      </SplitButton>
    </Flex>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
