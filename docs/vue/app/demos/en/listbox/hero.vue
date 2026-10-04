<script setup lang="ts">
  import { ref } from 'vue'
  import { Listbox } from '@hina-ui/vue'

  const status = ref('doing')
  const statuses = [
    { value: 'wish', label: 'Want to read' },
    { value: 'doing', label: 'Reading' },
    { value: 'done', label: 'Finished' },
    { value: 'dropped', label: 'Dropped' },
  ]
</script>

<template>
  <Listbox v-model="status" :options="statuses" aria-label="Collection status" class="w-56" />
</template>
