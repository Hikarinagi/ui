<script setup lang="ts">
  import { AppShell, NavLink, Sidebar, SidebarGroup, Text } from '@hina-ui/vue'
</script>

<template>
  <AppShell class="border-line h-96 w-full rounded-lg border">
    <template #sidebar>
      <Sidebar>
        <NavLink href="#" active label="Overview">Overview</NavLink>
        <SidebarGroup label="Library">
          <NavLink href="#" label="Galgame">Galgame</NavLink>
          <NavLink href="#" label="Light novels">Light novels</NavLink>
        </SidebarGroup>
        <SidebarGroup label="Creating" :default-open="false">
          <NavLink href="#" label="My entries">My entries</NavLink>
          <NavLink href="#" label="Drafts">Drafts</NavLink>
        </SidebarGroup>
      </Sidebar>
    </template>

    <Text size="sm" tone="muted" class="block p-6">The “Creating” group starts collapsed.</Text>
  </AppShell>
</template>
