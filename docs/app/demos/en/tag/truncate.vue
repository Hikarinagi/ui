<script setup lang="ts">
  import { Tag, Text } from '@hikarinagi/ui'
</script>

<template>
  <Tag class="max-w-40" tone="accent">
    <Text as="span" truncate>A very long tag name truncated at the container edge</Text>
  </Tag>
</template>
