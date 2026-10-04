<script setup lang="ts">
  import { Stack, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/vue'

  const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <Stack gap="lg" class="w-full max-w-md">
    <Stack v-for="size in sizes" :key="size" gap="xs">
      <Text tone="muted" size="sm">{{ size }}</Text>
      <Tabs default-value="a" :size="size">
        <TabsList :label="`Size ${size}`">
          <TabsTrigger value="a">Synopsis</TabsTrigger>
          <TabsTrigger value="b">Volumes</TabsTrigger>
        </TabsList>
        <TabsContent value="a" />
        <TabsContent value="b" />
      </Tabs>
    </Stack>
  </Stack>
</template>
