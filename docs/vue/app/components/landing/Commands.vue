<script setup lang="ts">
  import { computed } from 'vue'
  import { Bookmark, House, Library, Moon, PenLine, Settings } from '@lucide/vue'
  import { CommandPalette, type CommandItems } from '@hina-ui/vue'

  const { t } = useI18n()

  const items = computed<CommandItems>(() => [
    {
      label: t('landing.wall.commands.pages'),
      items: [
        { id: 'home', label: t('landing.wall.commands.home'), icon: House },
        { id: 'library', label: t('landing.wall.commands.library'), icon: Library },
        { id: 'bookmarks', label: t('landing.wall.commands.bookmarks'), icon: Bookmark },
        {
          id: 'settings',
          label: t('landing.wall.commands.settings'),
          icon: Settings,
          kbd: ['⌘', ','],
        },
      ],
    },
    {
      label: t('landing.wall.commands.actions'),
      items: [
        {
          id: 'review',
          label: t('landing.wall.commands.newReview'),
          icon: PenLine,
          description: t('landing.wall.commands.newReviewHint'),
        },
        { id: 'theme', label: t('landing.wall.commands.theme'), icon: Moon, kbd: ['⌘', 'D'] },
      ],
    },
  ])
</script>

<template>
  <CommandPalette
    inline
    :items="items"
    :placeholder="t('landing.wall.commands.placeholder')"
    class="w-[320px]"
  />
</template>
