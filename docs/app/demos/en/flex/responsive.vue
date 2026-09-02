<script setup lang="ts">
  import { Card, Flex, Heading, Text } from '@hikarinagi/ui'
</script>

<template>
  <Flex direction="col" gap="md" class="w-full max-w-lg sm:flex-row sm:items-center">
    <Card class="bg-inset h-24 shrink-0 sm:w-32" :padded="false" />
    <Flex direction="col" gap="xs">
      <Heading :level="3" size="md">Beyond the Stars</Heading>
      <Text tone="muted" size="sm">
        The cover sits above the text on a narrow screen and beside it on a wide one. Breakpoints
        override direction through Tailwind classes.
      </Text>
    </Flex>
  </Flex>
</template>
