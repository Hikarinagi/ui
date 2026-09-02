<script setup lang="ts">
  import { Mark, Stack, Text } from '@hina-ui/vue'

  const keyword = 'course'
  const paragraph =
    'Volume three of Course of Stars follows the opening of an ocean course, and the two lighthouses at either end of that course.'
  const parts = paragraph.split(keyword)
</script>

<template>
  <Stack class="max-w-lg">
    <Text size="sm" tone="muted">Keyword: {{ keyword }}</Text>
    <Text>
      <template v-for="(part, index) in parts" :key="index">
        {{ part }}
        <Mark v-if="index < parts.length - 1">{{ keyword }}</Mark>
      </template>
    </Text>
  </Stack>
</template>
