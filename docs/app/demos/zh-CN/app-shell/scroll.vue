<script setup lang="ts">
  import { AppShell, Heading, NavLink, Sidebar, Stack, Text } from '@hina-ui/vue'

  const paragraphs = Array.from({ length: 12 }, (_, i) => `第 ${i + 1} 段正文。`)
</script>

<template>
  <AppShell class="border-line h-72 w-full rounded-lg border">
    <template #sidebar>
      <Sidebar>
        <NavLink href="#" active label="正文">正文</NavLink>
        <NavLink href="#" label="注释">注释</NavLink>
      </Sidebar>
    </template>

    <template #header>
      <Heading :level="2" size="sm">标题栏不随内容滚动</Heading>
    </template>

    <Stack gap="sm" class="p-6">
      <Text v-for="p in paragraphs" :key="p" size="sm" tone="muted">{{ p }}</Text>
    </Stack>
  </AppShell>
</template>
