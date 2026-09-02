<script setup lang="ts">
  import { BookOpen, Gamepad2, House } from '@lucide/vue'
  import { AppShell, Heading, NavLink, Sidebar, SidebarTrigger, Text } from '@hina-ui/vue'
</script>

<template>
  <AppShell class="border-line h-96 w-full rounded-lg border">
    <template #sidebar>
      <Sidebar>
        <NavLink href="#" active label="Home">
          <template #icon><House /></template>
          Home
        </NavLink>
        <NavLink href="#" label="Galgame">
          <template #icon><Gamepad2 /></template>
          Galgame
        </NavLink>
        <NavLink href="#" label="Light novels">
          <template #icon><BookOpen /></template>
          Light novels
        </NavLink>
      </Sidebar>
    </template>

    <template #header>
      <SidebarTrigger />
      <Heading :level="2" size="sm">Home</Heading>
    </template>

    <Text size="sm" tone="muted" class="block p-6">
      Use the button in the header to collapse the sidebar.
    </Text>
  </AppShell>
</template>
