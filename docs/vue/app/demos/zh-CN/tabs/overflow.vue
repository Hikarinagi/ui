<script setup lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/vue'

  const genres = ['科幻', '悬疑', '日常', '校园', '治愈', '奇幻', '推理', '恋爱', '历史', '战记']
</script>

<template>
  <Tabs default-value="科幻" class="w-full max-w-sm">
    <TabsList label="题材">
      <TabsTrigger v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</TabsTrigger>
    </TabsList>
    <TabsContent v-for="genre in genres" :key="genre" :value="genre">
      <Text tone="muted" size="sm" class="block pt-4">{{ genre }}题材的作品列表。</Text>
    </TabsContent>
  </Tabs>
</template>
