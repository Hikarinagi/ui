<script setup lang="ts">
  import { House } from '@lucide/vue'
  import { AppShell, Image, NavLink, Sidebar, SidebarTrigger, Stack, Text } from '@hina-ui/vue'
  import Wordmark from '../../../components/docs/Wordmark.vue'

  const examples = [
    { mode: 'both', label: 'Icon and wordmark' },
    { mode: 'wordmark', label: 'Wordmark only' },
    { mode: 'icon', label: 'Icon only' },
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
              <Wordmark class="items-center" />
            </template>
            <NavLink href="#" active label="Overview" @click.prevent>
              <template #icon><House /></template>
              Overview
            </NavLink>
          </Sidebar>
        </template>
        <template #header>
          <SidebarTrigger />
          <Text size="sm" weight="medium">Brand slots</Text>
        </template>
        <Text size="sm" tone="muted" class="block p-6">{{ example.label }}</Text>
      </AppShell>
    </Stack>
  </Stack>
</template>
