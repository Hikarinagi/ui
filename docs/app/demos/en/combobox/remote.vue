<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Combobox, Stack, Text } from '@hina-ui/vue'

  const all = [
    { value: 'hikari', label: 'Hikari' },
    { value: 'nagi', label: 'Nagi' },
    { value: 'shion', label: 'Shion' },
    { value: 'kanade', label: 'Kanade' },
  ]
  const selectedOption = { value: 'hasekura', label: 'Isuna Hasekura' }
  const character = ref<string | null>(selectedOption.value)
  const search = ref('')
  const options = computed(() =>
    search.value ? all.filter(item => item.label.includes(search.value)) : all,
  )
</script>

<template>
  <Stack class="w-64">
    <Combobox
      v-model="character"
      v-model:search="search"
      :options="options"
      :selected-option="selectedOption"
      ignore-filter
      placeholder="Search characters"
      aria-label="Character"
    />
    <Text tone="muted">Results: {{ options.length }} · Value: {{ character ?? 'none' }}</Text>
  </Stack>
</template>
