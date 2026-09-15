<script setup lang="ts">
  import { ref } from 'vue'
  import { FileText, House, Images, Settings } from '@lucide/vue'
  import {
    AppShell,
    Avatar,
    Heading,
    Inline,
    NavLink,
    Sidebar,
    SidebarGroup,
    SidebarLabel,
    SidebarTrigger,
    Stack,
    Text,
    type SidebarState,
  } from '@hina-ui/vue'

  const selected = ref('overview')
  const groups = [
    {
      label: 'Content',
      items: [
        { id: 'overview', label: 'Overview', icon: House },
        { id: 'articles', label: 'Articles', icon: FileText },
        { id: 'library', label: 'Media library', icon: Images },
      ],
    },
    { label: 'Manage', items: [{ id: 'settings', label: 'Settings', icon: Settings }] },
  ]
  const examples = ref<{ mode: 'rail' | 'hidden'; state: SidebarState }[]>([
    { mode: 'rail', state: 'expanded' },
    { mode: 'hidden', state: 'expanded' },
  ])
</script>

<template>
  <Stack gap="lg" class="w-full">
    <Stack v-for="example in examples" :key="example.mode" gap="sm">
      <Text size="sm" tone="faint">collapsible="{{ example.mode }}" · {{ example.state }}</Text>
      <AppShell
        v-model:sidebar="example.state"
        :collapsible="example.mode"
        mobile-title="Hina UI"
        class="border-line h-112 w-full rounded-lg border"
      >
        <template #sidebar>
          <Sidebar>
            <template #header>
              <Inline gap="sm" align="center" :wrap="false">
                <Avatar src="/favicon.png" name="Hina UI" class="rounded-md" />
                <SidebarLabel as="div" class="flex-1">
                  <Stack gap="none">
                    <Text weight="medium" class="truncate">Hina UI</Text>
                    <Text size="xs" tone="muted" class="truncate">Workspace</Text>
                  </Stack>
                </SidebarLabel>
              </Inline>
            </template>

            <SidebarGroup v-for="group in groups" :key="group.label" :label="group.label">
              <NavLink
                v-for="item in group.items"
                :key="item.id"
                :href="`#${item.id}`"
                :label="item.label"
                :active="selected === item.id"
                @click.prevent="selected = item.id"
              >
                <template #icon><component :is="item.icon" /></template>
                {{ item.label }}
              </NavLink>
            </SidebarGroup>

            <template #footer>
              <Inline gap="sm" align="center" :wrap="false">
                <Avatar src="/avatars/paper.webp" name="Shion Hoshimi" />
                <SidebarLabel as="div" class="flex-1">
                  <Stack gap="none">
                    <Text size="sm" weight="medium" class="truncate">Shion Hoshimi</Text>
                    <Text size="xs" tone="muted" class="truncate">Administrator</Text>
                  </Stack>
                </SidebarLabel>
              </Inline>
            </template>
          </Sidebar>
        </template>
        <template #header>
          <SidebarTrigger />
          <Heading :level="2" size="sm" class="truncate">Creator workspace</Heading>
        </template>
        <Stack gap="sm" class="p-6">
          <Heading :level="3" size="sm">
            {{ groups.flatMap(group => group.items).find(item => item.id === selected)?.label }}
          </Heading>
          <Text size="sm" tone="muted">
            Toggle the sidebar to see the logo, groups and footer stay in place. On narrow screens,
            the button opens the drawer.
          </Text>
        </Stack>
      </AppShell>
    </Stack>
  </Stack>
</template>
