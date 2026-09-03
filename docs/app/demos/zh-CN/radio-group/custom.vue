<script setup lang="ts">
  import { ref } from 'vue'
  import { Monitor, Moon, Sun } from '@lucide/vue'
  import { RadioGroup, Inline } from '@hina-ui/vue'

  const icons = { light: Sun, dark: Moon, system: Monitor }
  const theme = ref('light')
  const options = [
    { value: 'light', label: '浅色' },
    { value: 'dark', label: '深色' },
    { value: 'system', label: '跟随系统' },
  ]
</script>

<template>
  <RadioGroup v-model="theme" :options="options" aria-label="主题">
    <template #option="{ option }">
      <Inline as="span" gap="xs" align="center">
        <component :is="icons[option.value as keyof typeof icons]" class="text-muted size-4" />
        {{ option.label }}
      </Inline>
    </template>
  </RadioGroup>
</template>
