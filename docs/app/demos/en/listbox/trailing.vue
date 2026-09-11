<script setup lang="ts">
  import { ref } from 'vue'
  import { Check } from '@lucide/vue'
  import { Card, Listbox, Text } from '@hina-ui/vue'

  const topic = ref('vue')
  const topics = [
    { value: 'vue', label: 'Vue' },
    {
      label: 'More topics',
      options: [
        { value: 'typescript', label: 'TypeScript' },
        { value: 'all', label: 'All topics' },
      ],
    },
  ]
  const counts: Record<string, number> = { vue: 128, typescript: 2048 }
</script>

<template>
  <Card :padded="false" class="w-64">
    <Listbox v-model="topic" :options="topics" variant="bare" :padded="false" aria-label="Topic">
      <template #option="{ option, selected }">
        <Text as="span" :weight="selected ? 'medium' : 'normal'" truncate>{{ option.label }}</Text>
      </template>
      <template #trailing="{ option, selected }">
        <Text
          v-if="option.value !== 'all'"
          as="span"
          size="xs"
          tone="muted"
          class="flex min-w-4 shrink-0 items-center justify-end"
        >
          <Check v-if="selected" aria-hidden="true" />
          <template v-else>{{ counts[option.value] }}</template>
        </Text>
      </template>
    </Listbox>
  </Card>
</template>
