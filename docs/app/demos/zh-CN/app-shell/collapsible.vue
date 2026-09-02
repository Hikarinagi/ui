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
      <Text size="sm" tone="faint">collapsible="rail"（默认）—— 当前 {{ railState }}</Text>
      <AppShell v-model:sidebar="railState" class="border-line h-64 rounded-lg border">
        <template #sidebar>
          <Sidebar>
            <NavLink href="#" active label="首页">
              <template #icon><House /></template>
              首页
            </NavLink>
            <NavLink href="#" label="轻小说">
              <template #icon><BookOpen /></template>
              轻小说
            </NavLink>
          </Sidebar>
        </template>
        <template #header><SidebarTrigger /></template>
        <Text size="sm" tone="muted" class="block p-6">收起后只剩图标。</Text>
      </AppShell>
    </Stack>

    <Stack gap="sm">
      <Text size="sm" tone="faint">collapsible="hidden" —— 当前 {{ hiddenState }}</Text>
      <AppShell
        v-model:sidebar="hiddenState"
        collapsible="hidden"
        class="border-line h-64 rounded-lg border"
      >
        <template #sidebar>
          <Sidebar>
            <NavLink href="#" active label="首页">
              <template #icon><House /></template>
              首页
            </NavLink>
            <NavLink href="#" label="轻小说">
              <template #icon><BookOpen /></template>
              轻小说
            </NavLink>
          </Sidebar>
        </template>
        <template #header><SidebarTrigger /></template>
        <Text size="sm" tone="muted" class="block p-6">收起后整条侧栏退场。</Text>
      </AppShell>
    </Stack>
  </Stack>
</template>
