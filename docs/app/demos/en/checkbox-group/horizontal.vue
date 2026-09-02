<script setup lang="ts">
  import { ref } from 'vue'
  import { CheckboxGroup } from '@hina-ui/vue'

  const days = ref(['sat', 'sun'])
  const options = [
    { value: 'mon', label: 'Mon' },
    { value: 'wed', label: 'Wed' },
    { value: 'fri', label: 'Fri' },
    { value: 'sat', label: 'Sat' },
    { value: 'sun', label: 'Sun' },
  ]
</script>

<template>
  <CheckboxGroup
    v-model="days"
    :options="options"
    orientation="horizontal"
    aria-label="Release days"
  />
</template>
