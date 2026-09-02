<script setup lang="ts">
  import { AspectRatio, Card, SimpleGrid, Stack, Tag, Text } from '@hina-ui/vue'

  const works = [
    { title: '星之彼方', tag: '科幻' },
    { title: '观测者的黎明', tag: '悬疑' },
    { title: '天文台的午后', tag: '日常' },
    { title: '银河另一端', tag: '科幻' },
  ]
</script>

<template>
  <SimpleGrid min="12rem" class="w-full max-w-2xl">
    <Card v-for="work in works" :key="work.title">
      <Stack gap="xs" align="start">
        <AspectRatio class="bg-inset w-full rounded-md" />
        <Text class="font-medium">{{ work.title }}</Text>
        <Tag>{{ work.tag }}</Tag>
      </Stack>
    </Card>
  </SimpleGrid>
</template>
