<script setup lang="ts">
  import { Card, SimpleGrid, Stack, Tag, Text } from '@hikarinagi/ui'

  const works = [
    { title: 'Beyond the Stars', tag: 'Sci-fi' },
    { title: 'Dawn of the Observer', tag: 'Mystery' },
    { title: 'Afternoon at the Observatory', tag: 'Slice of life' },
    { title: 'The Other Side of the Galaxy', tag: 'Sci-fi' },
  ]
</script>

<template>
  <SimpleGrid min="12rem" class="w-full max-w-2xl">
    <Card v-for="work in works" :key="work.title">
      <Stack gap="xs" align="start">
        <div class="bg-emphasis h-20 rounded-md" />
        <Text class="font-medium">{{ work.title }}</Text>
        <Tag>{{ work.tag }}</Tag>
      </Stack>
    </Card>
  </SimpleGrid>
</template>
