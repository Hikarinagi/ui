<script setup lang="ts">
  import { Mark, Stack, Text } from '@hina-ui/vue'

  const keyword = '航路'
  const paragraph = '狼と香辛料 第一卷讲述行商人与自称丰收之神的少女同行的旅途。'
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
