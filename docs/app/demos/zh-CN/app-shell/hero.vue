<script setup lang="ts">
  import { BookOpen, Gamepad2, House } from '@lucide/vue'
  import { AppShell, Heading, NavLink, Sidebar, SidebarTrigger, Text } from '@hina-ui/vue'
</script>

<template>
  <AppShell class="border-line h-96 w-full rounded-lg border">
    <template #sidebar>
      <Sidebar>
        <NavLink href="#" active label="首页">
          <template #icon><House /></template>
          首页
        </NavLink>
        <NavLink href="#" label="Galgame">
          <template #icon><Gamepad2 /></template>
          Galgame
        </NavLink>
        <NavLink href="#" label="轻小说">
          <template #icon><BookOpen /></template>
          轻小说
        </NavLink>
      </Sidebar>
    </template>

    <template #header>
      <SidebarTrigger />
      <Heading :level="2" size="sm">首页</Heading>
    </template>

    <Text size="sm" tone="muted" class="block p-6">点击左上角的按钮可以收起侧栏。</Text>
  </AppShell>
</template>
