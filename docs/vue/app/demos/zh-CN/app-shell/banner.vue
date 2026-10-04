<script setup lang="ts">
  import {
    AppShell,
    Banner,
    Heading,
    Link,
    NavLink,
    Sidebar,
    SidebarTrigger,
    Text,
  } from '@hina-ui/vue'
</script>

<template>
  <AppShell collapsible="hidden" class="border-line h-96 w-full rounded-lg border">
    <template #banner>
      <Banner closable>
        Hina UI 1.2 已发布。
        <Link href="#" underline>查看更新说明</Link>
      </Banner>
    </template>

    <template #sidebar>
      <Sidebar>
        <NavLink href="#" active label="首页">首页</NavLink>
        <NavLink href="#" label="我的书架">我的书架</NavLink>
      </Sidebar>
    </template>

    <template #header>
      <SidebarTrigger />
      <Heading :level="2" size="sm">首页</Heading>
    </template>

    <Text size="sm" tone="muted" class="block p-6">关闭公告条后，侧栏与主区域一起上移补满。</Text>
  </AppShell>
</template>
