<script setup lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/vue'
</script>

<template>
  <Tabs default-value="reading" class="w-full max-w-md">
    <TabsList label="Shelf">
      <TabsTrigger value="reading">Reading</TabsTrigger>
      <TabsTrigger value="planned">Want to read</TabsTrigger>
      <TabsTrigger value="finished">Read</TabsTrigger>
    </TabsList>
    <TabsContent value="reading">
      <Text tone="muted" size="sm" class="block pt-4">Three works in progress.</Text>
    </TabsContent>
    <TabsContent value="planned">
      <Text tone="muted" size="sm" class="block pt-4">Twelve works saved for later.</Text>
    </TabsContent>
    <TabsContent value="finished">
      <Text tone="muted" size="sm" class="block pt-4">Forty-eight works finished.</Text>
    </TabsContent>
  </Tabs>
</template>
