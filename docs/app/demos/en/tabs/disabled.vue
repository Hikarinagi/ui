<script setup lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/vue'
</script>

<template>
  <Tabs default-value="public" class="w-full max-w-md">
    <TabsList label="Visibility">
      <TabsTrigger value="public">Public</TabsTrigger>
      <TabsTrigger value="friends">Followers only</TabsTrigger>
      <TabsTrigger value="private" disabled>Private (sign in required)</TabsTrigger>
    </TabsList>
    <TabsContent value="public">
      <Text tone="muted" size="sm" class="block pt-4">Anyone can see this list.</Text>
    </TabsContent>
    <TabsContent value="friends">
      <Text tone="muted" size="sm" class="block pt-4">Only people who follow you can see it.</Text>
    </TabsContent>
    <TabsContent value="private">
      <Text tone="muted" size="sm" class="block pt-4">Only you can see it.</Text>
    </TabsContent>
  </Tabs>
</template>
