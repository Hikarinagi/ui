<script setup lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/vue'

  const genres = [
    'Sci-fi',
    'Mystery',
    'Slice of life',
    'School',
    'Healing',
    'Fantasy',
    'Detective',
    'Romance',
    'Historical',
    'War',
  ]
</script>

<template>
  <Tabs default-value="Sci-fi" class="w-full max-w-sm">
    <TabsList label="Genre">
      <TabsTrigger v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</TabsTrigger>
    </TabsList>
    <TabsContent v-for="genre in genres" :key="genre" :value="genre">
      <Text tone="muted" size="sm" class="block pt-4">Works tagged {{ genre }}.</Text>
    </TabsContent>
  </Tabs>
</template>
