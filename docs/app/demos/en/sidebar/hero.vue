<script setup lang="ts">
  import { BookOpen, Gamepad2, House, Library } from '@lucide/vue'
  import { AppShell, NavLink, Sidebar, SidebarGroup, SidebarTrigger, Text } from '@hina-ui/vue'
</script>

<template>
  <AppShell class="border-line h-96 w-full rounded-lg border">
    <template #sidebar>
      <Sidebar>
        <NavLink href="#" active label="Home">
          <template #icon><House /></template>
          Home
        </NavLink>
        <SidebarGroup label="Library">
          <NavLink href="#" label="Galgame">
            <template #icon><Gamepad2 /></template>
            Galgame
          </NavLink>
          <NavLink href="#" label="Light novels">
            <template #icon><BookOpen /></template>
            Light novels
          </NavLink>
          <NavLink href="#" label="Manga">
            <template #icon><Library /></template>
            Manga
          </NavLink>
        </SidebarGroup>
      </Sidebar>
    </template>

    <template #header><SidebarTrigger /></template>
    <Text size="sm" tone="muted" class="block p-6">Collapse the sidebar to see the rail form.</Text>
  </AppShell>
</template>
