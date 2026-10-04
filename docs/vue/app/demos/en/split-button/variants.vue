<script setup lang="ts">
  import { ref } from 'vue'
  import { DropdownMenuItem, Flex, SplitButton, Stack, Text } from '@hina-ui/vue'

  const variants = ['solid', 'soft', 'outline', 'ghost'] as const
  const result = ref('Each style keeps its primary action separate from the menu')
</script>

<template>
  <Stack align="center" gap="lg">
    <Flex wrap justify="center" gap="lg">
      <SplitButton
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
        :menu-label="`${variant} options`"
        @click="result = `${variant}: saved`"
      >
        {{ variant }}
        <template #content>
          <DropdownMenuItem @select="result = `${variant}: save a copy`">
            Save a copy
          </DropdownMenuItem>
        </template>
      </SplitButton>
    </Flex>
    <Flex wrap justify="center" gap="lg">
      <SplitButton
        tone="neutral"
        menu-label="Download options"
        @click="result = 'Action: download'"
      >
        Download
        <template #content>
          <DropdownMenuItem @select="result = 'Action: copy link'">Copy link</DropdownMenuItem>
        </template>
      </SplitButton>
      <SplitButton
        tone="danger"
        variant="soft"
        menu-label="Archive options"
        @click="result = 'Action: archive'"
      >
        Archive
        <template #content>
          <DropdownMenuItem @select="result = 'Action: move to trash'">
            Move to trash
          </DropdownMenuItem>
        </template>
      </SplitButton>
    </Flex>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
