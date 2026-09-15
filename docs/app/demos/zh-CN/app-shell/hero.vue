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
  } from '@hina-ui/vue'

  const selected = ref('overview')
  const groups = [
    {
      label: '内容',
      items: [
        { id: 'overview', label: '概览', icon: House },
        { id: 'articles', label: '文章', icon: FileText },
        { id: 'library', label: '媒体库', icon: Images },
      ],
    },
    { label: '管理', items: [{ id: 'settings', label: '设置', icon: Settings }] },
  ]
</script>

<template>
  <AppShell mobile-title="Hina UI" class="border-line h-112 w-full rounded-lg border">
    <template #sidebar>
      <Sidebar>
        <template #icon>
          <Avatar src="/favicon.png" name="Hina UI" class="rounded-md" />
        </template>
        <template #wordmark>
          <Stack gap="none">
            <Text weight="medium" class="truncate">Hina UI</Text>
            <Text size="xs" tone="muted" class="truncate">工作空间</Text>
          </Stack>
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
            <Avatar src="/avatars/paper.webp" name="星见书音" />
            <SidebarLabel as="div" class="flex-1">
              <Stack gap="none">
                <Text size="sm" weight="medium" class="truncate">星见书音</Text>
                <Text size="xs" tone="muted" class="truncate">管理员</Text>
              </Stack>
            </SidebarLabel>
          </Inline>
        </template>
      </Sidebar>
    </template>
    <template #header>
      <SidebarTrigger />
      <Heading :level="2" size="sm" class="truncate">创作者中心</Heading>
    </template>
    <Stack gap="sm" class="p-6">
      <Heading :level="3" size="sm">
        {{ groups.flatMap(group => group.items).find(item => item.id === selected)?.label }}
      </Heading>
      <Text size="sm" tone="muted">切换侧栏，观察标识、分组与页脚的位置。窄屏时打开抽屉。</Text>
    </Stack>
  </AppShell>
</template>
