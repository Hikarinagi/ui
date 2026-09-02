<script setup lang="ts">
  import { AspectRatio, Card, Grid, Stack, Tag, Text } from '@hikarinagi/ui'

  const works = [
    { title: '星之彼方', tag: '科幻' },
    { title: '观测者的黎明', tag: '悬疑' },
    { title: '天文台的午后', tag: '日常' },
    { title: '银河另一端', tag: '科幻' },
    { title: '书页之间', tag: '校园' },
    { title: '静谧的信号', tag: '治愈' },
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
