<script setup lang="ts">
  import { ref } from 'vue'
  import { CheckboxGroup } from '@hina-ui/vue'

  const types = ref(['gal', 'ln'])
  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: 'Light novel' },
    { value: 'manga', label: 'Manga' },
  ]
</script>

<template>
  <CheckboxGroup v-model="types" :options="options" aria-label="Work types" />
</template>
