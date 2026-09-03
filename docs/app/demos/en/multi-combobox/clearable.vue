<script setup lang="ts">
  import { ref } from 'vue'
  import { MultiCombobox } from '@hina-ui/vue'

  const studios = ref<Array<string | number>>([1, 2])
  const options = [
    { value: 1, label: 'Key' },
    { value: 2, label: 'Type-Moon' },
    { value: 3, label: 'Nitroplus' },
  ]
</script>

<template>
  <MultiCombobox v-model="studios" :options="options" clearable aria-label="Studios" class="w-80" />
</template>
