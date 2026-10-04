<script setup lang="ts">
  import { Button, Drawer, Stack, Text } from '@hina-ui/vue'

  const items = Array.from(
    { length: 30 },
    (_, i) =>
      `Notification ${i + 1}: placeholder text, long enough that the body actually scrolls.`,
  )
</script>

<template>
  <Drawer
    title="All notifications"
    description="The title and footer stay put while the list scrolls."
  >
    <Button variant="outline" tone="neutral">See all</Button>
    <template #content>
      <Stack gap="sm">
        <Text v-for="item in items" :key="item">{{ item }}</Text>
      </Stack>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" @click="close">Mark all as read</Button>
    </template>
  </Drawer>
</template>
