<script setup lang="ts">
  import { BookMarked, House, Star } from '@lucide/vue'
  import { AppShell, Avatar, Inline, NavLink, Sidebar, Text } from '@hina-ui/vue'
</script>

<template>
  <AppShell class="border-line h-80 w-full rounded-lg border">
    <template #sidebar>
      <Sidebar label="站内导航">
        <template #header>
          <Inline gap="sm" align="center">
            <BookMarked class="size-5" aria-hidden="true" />
            <Text weight="medium">光凪文库</Text>
          </Inline>
        </template>

        <NavLink href="#" active label="概览">
          <template #icon><House /></template>
          概览
        </NavLink>
        <NavLink href="#" label="收藏">
          <template #icon><Star /></template>
          收藏
        </NavLink>

        <template #footer>
          <Inline gap="sm" align="center">
            <Avatar size="sm" name="星见书音" />
            <Text size="sm" tone="muted">星见书音</Text>
          </Inline>
        </template>
      </Sidebar>
    </template>

    <Text size="sm" tone="muted" class="block p-6">页眉与页脚固定在两端，不随条目滚动。</Text>
  </AppShell>
</template>
