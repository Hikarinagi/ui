<script setup lang="ts">
  import { ref, type Component } from 'vue'
  import { BookOpen, Clapperboard, Gamepad2 } from '@lucide/vue'
  import { Inline, Select, Stack, Text, type SelectOption } from '@hina-ui/vue'

  const type = ref('gal')
  const types: SelectOption<{ icon: Component }>[] = [
    { icon: Gamepad2, value: 'gal', label: 'Galgame', description: '视觉小说与冒险游戏' },
    { icon: BookOpen, value: 'ln', label: '轻小说', description: '文库本与网络连载' },
    { icon: Clapperboard, value: 'anime', label: '动画', description: 'TV、剧场版与 OVA' },
  ]
</script>

<template>
  <Select v-model="type" :options="types" aria-label="作品类型" class="w-64">
    <template #value="{ option }">
      <Inline as="span" gap="sm" :wrap="false">
        <component :is="option.icon" />
        {{ option.label }}
      </Inline>
    </template>
    <template #option="{ option }">
      <Inline as="span" gap="sm" :wrap="false">
        <component :is="option.icon" />
        <Stack as="span" gap="none" class="min-w-0">
          <Text as="span">{{ option.label }}</Text>
          <Text as="span" size="xs" tone="muted">{{ option.description }}</Text>
        </Stack>
      </Inline>
    </template>
  </Select>
</template>
