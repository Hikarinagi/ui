<script setup lang="ts">
  import { House } from '@lucide/vue'
  import { AppShell, Image, NavLink, Sidebar, SidebarTrigger, Stack, Text } from '@hina-ui/vue'
  import Wordmark from '../../../components/docs/Wordmark.vue'

  const examples = [
    { mode: 'both', label: '图标与字标' },
    { mode: 'wordmark', label: '只有字标' },
    { mode: 'icon', label: '只有图标' },
  ]
</script>

<template>
  <Stack gap="lg" class="w-full">
    <Stack v-for="example in examples" :key="example.mode" gap="sm">
      <Text size="sm" tone="muted">{{ example.label }}</Text>
      <AppShell mobile-title="Hina UI" class="border-line h-52 w-full rounded-lg border">
        <template #sidebar>
          <Sidebar>
            <template v-if="example.mode !== 'wordmark'" #icon>
              <Image src="/favicon.png" alt="Hina UI" class="rounded-md" />
            </template>
            <template v-if="example.mode !== 'icon'" #wordmark>
              <Wordmark />
            </template>
            <NavLink href="#" active label="概览" @click.prevent>
              <template #icon><House /></template>
              概览
            </NavLink>
          </Sidebar>
        </template>
        <template #header>
          <SidebarTrigger />
          <Text size="sm" weight="medium">品牌插槽</Text>
        </template>
        <Text size="sm" tone="muted" class="block p-6">{{ example.label }}</Text>
      </AppShell>
    </Stack>
  </Stack>
</template>
