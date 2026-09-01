<script setup lang="ts">
  import { Card, Grid, Stack, Tag, Text } from '@hikarinagi/ui'

  const works = [
    { title: 'Beyond the Stars', tag: 'Sci-fi' },
    { title: 'Dawn of the Observer', tag: 'Mystery' },
    { title: 'Afternoon at the Observatory', tag: 'Slice of life' },
    { title: 'The Other Side of the Galaxy', tag: 'Sci-fi' },
    { title: 'Between the Pages', tag: 'School' },
    { title: 'A Quiet Signal', tag: 'Healing' },
  ]
</script>

<template>
  <Grid :cols="3" class="w-full max-w-2xl">
    <Card v-for="work in works" :key="work.title">
      <Stack gap="xs">
        <div class="bg-emphasis h-20 rounded-md" />
        <Text class="font-medium">{{ work.title }}</Text>
        <Tag>{{ work.tag }}</Tag>
      </Stack>
    </Card>
  </Grid>
</template>
