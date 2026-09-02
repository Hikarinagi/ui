<script setup lang="ts">
  import { ref } from 'vue'
  import { BookOpen, Gamepad2, Images } from '@lucide/vue'
  import { CheckboxGroup, Inline } from '@hina-ui/vue'

  const icons = { gal: Gamepad2, ln: BookOpen, manga: Images }
  const types = ref(['gal'])
  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
    { value: 'manga', label: '漫画' },
  ]
</script>

<template>
  <CheckboxGroup v-model="types" :options="options" aria-label="作品类型">
    <template #option="{ option }">
      <Inline as="span" gap="xs" align="center">
        <component :is="icons[option.value as keyof typeof icons]" class="text-muted size-4" />
        {{ option.label }}
      </Inline>
    </template>
  </CheckboxGroup>
</template>
