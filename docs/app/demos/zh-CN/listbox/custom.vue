<script setup lang="ts">
  import { ref, type Component } from 'vue'
  import { BookOpen, Clapperboard, Gamepad2 } from '@lucide/vue'
  import { Inline, Listbox, Stack, Text } from '@hina-ui/vue'

  const type = ref('gal')
  const types = [
    { value: 'gal', label: 'Galgame', description: '视觉小说与冒险游戏' },
    { value: 'ln', label: '轻小说', description: '文库本与网络连载' },
    { value: 'anime', label: '动画', description: 'TV、剧场版与 OVA' },
  ]
  const icons: Record<string, Component> = { gal: Gamepad2, ln: BookOpen, anime: Clapperboard }
</script>

<template>
  <Listbox v-model="type" :options="types" aria-label="作品类型" class="w-64">
    <template #option="{ option }">
      <Inline as="span" gap="sm" :wrap="false">
        <component :is="icons[option.value]" />
        <Stack as="span" gap="none" class="min-w-0">
          <Text as="span">{{ option.label }}</Text>
          <Text as="span" size="xs" tone="muted">{{ option.description }}</Text>
        </Stack>
      </Inline>
    </template>
  </Listbox>
</template>
