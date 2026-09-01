<script setup lang="ts">
  import { Card, Flex, Heading, Text } from '@hikarinagi/ui'
</script>

<template>
  <Flex direction="col" gap="md" class="w-full max-w-lg sm:flex-row sm:items-center">
    <Card class="bg-emphasis h-24 shrink-0 sm:w-32" :padded="false" />
    <Flex direction="col" gap="xs">
      <Heading :level="3" size="md">星之彼方</Heading>
      <Text tone="muted" size="sm">
        窄屏时封面在上、文字在下，宽屏时并排。断点用 Tailwind 的类覆盖 direction。
      </Text>
    </Flex>
  </Flex>
</template>
