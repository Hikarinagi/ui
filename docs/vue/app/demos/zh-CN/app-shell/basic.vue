<script setup lang="ts">
  import { AppShell, NavLink, Sidebar, Text } from '@hina-ui/vue'
</script>

<template>
  <AppShell class="border-line h-72 w-full rounded-lg border">
    <template #sidebar>
      <Sidebar>
        <NavLink href="#" active label="概览">概览</NavLink>
        <NavLink href="#" label="我的书架">我的书架</NavLink>
      </Sidebar>
    </template>

    <Text size="sm" tone="muted" class="block p-6">主区域的内容放在默认插槽里。</Text>
  </AppShell>
</template>
