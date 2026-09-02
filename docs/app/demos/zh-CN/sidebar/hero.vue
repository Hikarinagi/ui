<script setup lang="ts">
  import { BookOpen, Gamepad2, House, Library } from '@lucide/vue'
  import { AppShell, NavLink, Sidebar, SidebarGroup, SidebarTrigger, Text } from '@hina-ui/vue'
</script>

<template>
  <AppShell class="border-line h-96 w-full rounded-lg border">
    <template #sidebar>
      <Sidebar>
        <NavLink href="#" active label="首页">
          <template #icon><House /></template>
          首页
        </NavLink>
        <SidebarGroup label="作品库">
          <NavLink href="#" label="Galgame">
            <template #icon><Gamepad2 /></template>
            Galgame
          </NavLink>
          <NavLink href="#" label="轻小说">
            <template #icon><BookOpen /></template>
            轻小说
          </NavLink>
          <NavLink href="#" label="漫画">
            <template #icon><Library /></template>
            漫画
          </NavLink>
        </SidebarGroup>
      </Sidebar>
    </template>

    <template #header><SidebarTrigger /></template>
    <Text size="sm" tone="muted" class="block p-6">收起侧栏可以看到 rail 形态。</Text>
  </AppShell>
</template>
