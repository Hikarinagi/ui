<script setup lang="ts">
  import { Stack, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/vue'
</script>

<template>
  <Tabs default-value="intro" class="w-full max-w-md">
    <TabsList label="Work details">
      <TabsTrigger value="intro">Synopsis</TabsTrigger>
      <TabsTrigger value="volumes">Volumes</TabsTrigger>
      <TabsTrigger value="staff">Staff</TabsTrigger>
    </TabsList>
    <TabsContent value="intro">
      <Stack gap="xs" class="pt-4">
        <Text tone="muted" size="sm">
          On my first day at the new school I met a girl on the roof holding an old camera.
        </Text>
      </Stack>
    </TabsContent>
    <TabsContent value="volumes">
      <Stack gap="xs" class="pt-4">
        <Text tone="muted" size="sm">Seven volumes so far, with the eighth due this winter.</Text>
      </Stack>
    </TabsContent>
    <TabsContent value="staff">
      <Stack gap="xs" class="pt-4">
        <Text tone="muted" size="sm">Written by Isuna Hasekura, illustrated by Jyuu Ayakura.</Text>
      </Stack>
    </TabsContent>
  </Tabs>
</template>
