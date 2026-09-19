<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Autocomplete, FormField, Stack, Text } from '@hina-ui/vue'

  const text = ref('')
  const candidates = ['Vue', 'React', 'Svelte', 'Solid', 'Angular']
  const options = computed(() =>
    candidates
      .filter(label => label.toLowerCase().includes(text.value.toLowerCase()))
      .map(label => ({ value: label, label })),
  )
</script>

<template>
  <Stack class="w-full max-w-sm">
    <FormField label="框架" description="选择建议，也可以保留自己输入的文字。">
      <Autocomplete v-model="text" :options="options" placeholder="输入框架名称" />
    </FormField>
    <Text tone="muted" size="sm">文本：{{ text || '—' }}</Text>
  </Stack>
</template>
