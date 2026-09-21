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
    <FormField label="Framework" description="Choose a suggestion or keep your own text.">
      <Autocomplete v-model="text" :options="options" placeholder="Type a framework name" />
    </FormField>
    <Text tone="muted" size="sm">Text: {{ text || '—' }}</Text>
  </Stack>
</template>
