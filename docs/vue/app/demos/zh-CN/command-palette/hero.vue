<script setup lang="ts">
  import { Bookmark, Home, Library, LogOut, Moon, PenLine, Search, Settings } from '@lucide/vue'
  import { ref } from 'vue'
  import { Button, CommandPalette, Kbd, Stack, Text, type CommandItems } from '@hina-ui/vue'

  const picked = ref('')

  const items: CommandItems = [
    {
      label: '页面',
      items: [
        { id: 'home', label: '首页', icon: Home, keywords: ['home'] },
        { id: 'library', label: '书架', icon: Library, keywords: ['library'] },
        { id: 'bookmarks', label: '收藏', icon: Bookmark, keywords: ['bookmark'] },
        { id: 'settings', label: '设置', icon: Settings, keywords: ['settings'], kbd: ['⌘', ','] },
      ],
    },
    {
      label: '操作',
      items: [
        { id: 'review', label: '新建书评', icon: PenLine, description: '记录一本刚读完的书' },
        { id: 'theme', label: '切换主题', icon: Moon, kbd: ['⌘', 'D'] },
        { id: 'logout', label: '退出登录', icon: LogOut },
      ],
    },
  ]
</script>

<template>
  <Stack gap="md" align="start">
    <CommandPalette :items="items" hotkey="mod+j" @select="item => (picked = item.label)">
      <Button variant="outline" tone="neutral">
        <template #icon><Search /></template>
        搜索
        <Kbd>⌘J</Kbd>
      </Button>
    </CommandPalette>
    <Text v-if="picked" size="sm" tone="muted">已选择：{{ picked }}</Text>
  </Stack>
</template>
