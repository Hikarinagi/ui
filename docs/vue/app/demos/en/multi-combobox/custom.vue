<script setup lang="ts">
  import { ref } from 'vue'
  import { Inline, MultiCombobox, Text } from '@hina-ui/vue'

  const tags = ref<Array<string | number>>([12])
  const options = [
    { value: 12, label: 'School', description: '1,204 works' },
    { value: 34, label: 'Science fiction', description: '388 works' },
    { value: 56, label: 'Romance', description: '2,019 works' },
    { value: 78, label: 'Mystery', description: '271 works' },
  ]
</script>

<template>
  <MultiCombobox v-model="tags" :options="options" aria-label="Tags" class="w-80">
    <template #option="{ option }">
      <Inline gap="sm" align="center" :wrap="false" class="min-w-0">
        <Text as="span" class="truncate">{{ option.label }}</Text>
        <Text as="span" tone="muted" size="xs" class="ms-auto shrink-0 font-mono">
          #{{ option.value }}
        </Text>
      </Inline>
    </template>
  </MultiCombobox>
</template>
