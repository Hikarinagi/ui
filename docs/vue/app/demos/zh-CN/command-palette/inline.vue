<script setup lang="ts">
  import { Bookmark, Home, Library, Moon, PenLine, Settings } from '@lucide/vue'
  import { CommandPalette, type CommandItems } from '@hina-ui/vue'

  const items: CommandItems = [
    {
      label: '页面',
      items: [
        { id: 'home', label: '首页', icon: Home },
        { id: 'library', label: '书架', icon: Library },
        { id: 'bookmarks', label: '收藏', icon: Bookmark },
        { id: 'settings', label: '设置', icon: Settings, kbd: ['⌘', ','] },
      ],
    },
    {
      label: '操作',
      items: [
        { id: 'review', label: '新建书评', icon: PenLine, description: '记录一本刚读完的书' },
        { id: 'theme', label: '切换主题', icon: Moon, kbd: ['⌘', 'D'] },
      ],
    },
  ]
</script>

<template>
  <CommandPalette inline :items="items" class="max-w-sm" />
</template>
