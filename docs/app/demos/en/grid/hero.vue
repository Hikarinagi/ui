<script setup lang="ts">
  import { AspectRatio, Card, Grid, Stack, Tag, Text } from '@hina-ui/vue'

  const works = [
    { title: 'ATRI', tag: 'Sci-fi' },
    { title: 'Sakura no Uta', tag: 'Drama' },
    { title: 'Afternoon at the Observatory', tag: 'Slice of life' },
    { title: 'The Other Side of the Galaxy', tag: 'Sci-fi' },
    { title: 'Between the Pages', tag: 'School' },
    { title: 'A Quiet Signal', tag: 'Healing' },
  ]
</script>

<template>
  <Grid :cols="3" class="w-full max-w-2xl">
    <Card v-for="work in works" :key="work.title">
      <Stack gap="xs" align="start">
        <AspectRatio class="bg-inset w-full rounded-md" />
        <Text class="font-medium">{{ work.title }}</Text>
        <Tag>{{ work.tag }}</Tag>
      </Stack>
    </Card>
  </Grid>
</template>
