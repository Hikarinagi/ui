<script setup lang="ts">
  import { AppShell, NavLink, Sidebar, Text } from '@hina-ui/vue'
</script>

<template>
  <AppShell class="border-line h-72 w-full rounded-lg border">
    <template #sidebar>
      <Sidebar>
        <NavLink href="#" active label="Overview">Overview</NavLink>
        <NavLink href="#" label="My shelf">My shelf</NavLink>
      </Sidebar>
    </template>

    <Text size="sm" tone="muted" class="block p-6">Main content goes in the default slot.</Text>
  </AppShell>
</template>
