<script setup lang="ts">
  import { Mark, Stack, Text } from '@hikarinagi/ui'

  const keyword = '航路'
  const paragraph = '星之航路第三卷讲述了远洋航路的开辟，以及航路两端的两座灯塔。'
  const parts = paragraph.split(keyword)
</script>

<template>
  <Stack class="max-w-lg">
    <Text size="sm" tone="muted">关键词：{{ keyword }}</Text>
    <Text>
      <template v-for="(part, index) in parts" :key="index">
        {{ part }}
        <Mark v-if="index < parts.length - 1">{{ keyword }}</Mark>
      </template>
    </Text>
  </Stack>
</template>
