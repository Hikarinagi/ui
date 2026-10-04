<script setup lang="ts">
  import { ref, type Component } from 'vue'
  import { BookOpen, Clapperboard, Gamepad2 } from '@lucide/vue'
  import { Inline, Select, Stack, Text, type SelectOption } from '@hina-ui/vue'

  const type = ref('gal')
  const types: SelectOption<{ icon: Component }>[] = [
    {
      icon: Gamepad2,
      value: 'gal',
      label: 'Galgame',
      description: 'Visual novels and adventure games',
    },
    {
      icon: BookOpen,
      value: 'ln',
      label: 'Light novel',
      description: 'Bunko volumes and web serials',
    },
    { icon: Clapperboard, value: 'anime', label: 'Anime', description: 'TV, films and OVAs' },
  ]
</script>

<template>
  <Select v-model="type" :options="types" aria-label="Work type" class="w-64">
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
