<script setup lang="ts">
  import { ref } from 'vue'
  import { BookOpen, House } from '@lucide/vue'
  import {
    AppShell,
    NavLink,
    Sidebar,
    SidebarTrigger,
    Stack,
    Text,
    type SidebarState,
  } from '@hina-ui/vue'

  const railState = ref<SidebarState>('expanded')
  const hiddenState = ref<SidebarState>('expanded')
</script>

<template>
  <Stack gap="lg" class="w-full">
    <Stack gap="sm">
      <Text size="sm" tone="faint">collapsible="rail" (default) — now {{ railState }}</Text>
      <AppShell v-model:sidebar="railState" class="border-line h-64 rounded-lg border">
        <template #sidebar>
          <Sidebar>
            <NavLink href="#" active label="Home">
              <template #icon><House /></template>
              Home
            </NavLink>
            <NavLink href="#" label="Light novels">
              <template #icon><BookOpen /></template>
              Light novels
            </NavLink>
          </Sidebar>
        </template>
        <template #header><SidebarTrigger /></template>
        <Text size="sm" tone="muted" class="block p-6">Collapsed, only the icons remain.</Text>
      </AppShell>
    </Stack>

    <Stack gap="sm">
      <Text size="sm" tone="faint">collapsible="hidden" — now {{ hiddenState }}</Text>
      <AppShell
        v-model:sidebar="hiddenState"
        collapsible="hidden"
        class="border-line h-64 rounded-lg border"
      >
        <template #sidebar>
          <Sidebar>
            <NavLink href="#" active label="Home">
              <template #icon><House /></template>
              Home
            </NavLink>
            <NavLink href="#" label="Light novels">
              <template #icon><BookOpen /></template>
              Light novels
            </NavLink>
          </Sidebar>
        </template>
        <template #header><SidebarTrigger /></template>
        <Text size="sm" tone="muted" class="block p-6">Collapsed, the whole sidebar leaves.</Text>
      </AppShell>
    </Stack>
  </Stack>
</template>
