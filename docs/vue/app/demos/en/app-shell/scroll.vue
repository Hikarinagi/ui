<script setup lang="ts">
  import { AppShell, Heading, NavLink, Sidebar, Stack, Text } from '@hina-ui/vue'

  const paragraphs = Array.from({ length: 12 }, (_, i) => `Paragraph ${i + 1}.`)
</script>

<template>
  <AppShell class="border-line h-72 w-full rounded-lg border">
    <template #sidebar>
      <Sidebar>
        <NavLink href="#" active label="Body">Body</NavLink>
        <NavLink href="#" label="Notes">Notes</NavLink>
      </Sidebar>
    </template>

    <template #header>
      <Heading :level="2" size="sm">The header does not scroll with the content</Heading>
    </template>

    <Stack gap="sm" class="p-6">
      <Text v-for="p in paragraphs" :key="p" size="sm" tone="muted">{{ p }}</Text>
    </Stack>
  </AppShell>
</template>
