<script setup lang="ts">
  import { ref } from 'vue'
  import { Listbox } from '@hina-ui/vue'

  const year = ref(2020)
  const years = Array.from({ length: 30 }, (_, i) => ({ value: 1996 + i, label: `` }))
</script>

<template>
  <Listbox v-model="year" :options="years" max-height="12rem" aria-label="Year" class="w-40" />
</template>
