<script setup lang="ts">
  import { ref, type Component } from 'vue'
  import { BookOpen, Clapperboard, Gamepad2 } from '@lucide/vue'
  import { Inline, MultiSelect } from '@hina-ui/vue'

  const types = ref(['gal'])
  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
    { value: 'anime', label: '动画' },
  ]
  const icons: Record<string, Component> = { gal: Gamepad2, ln: BookOpen, anime: Clapperboard }
</script>

<template>
  <MultiSelect v-model="types" :options="options" aria-label="作品类型" class="w-72">
    <template #option="{ option }">
      <Inline as="span" gap="sm" :wrap="false">
        <component :is="icons[option.value]" />
        {{ option.label }}
      </Inline>
    </template>
  </MultiSelect>
</template>
