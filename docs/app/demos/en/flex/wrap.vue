<script setup lang="ts">
  import { Card, Flex, Stack, Text } from '@hikarinagi/ui'

  const items = Array.from({ length: 10 }, (_, i) => i + 1)
</script>

<template>
  <Stack class="w-full max-w-xs">
    <Stack gap="xs">
      <Text tone="muted" size="sm">With wrap, items move to the next line</Text>
      <Flex wrap gap="sm">
        <Card v-for="i in items" :key="i" class="bg-inset size-10" :padded="false" />
      </Flex>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">Without it they stay on one line</Text>
      <Flex gap="sm" class="overflow-hidden">
        <Card v-for="i in items" :key="i" class="bg-inset size-10 shrink-0" :padded="false" />
      </Flex>
    </Stack>
  </Stack>
</template>
