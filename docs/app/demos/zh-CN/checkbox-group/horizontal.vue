<script setup lang="ts">
  import { ref } from 'vue'
  import { CheckboxGroup } from '@hina-ui/vue'

  const days = ref(['sat', 'sun'])
  const options = [
    { value: 'mon', label: '周一' },
    { value: 'wed', label: '周三' },
    { value: 'fri', label: '周五' },
    { value: 'sat', label: '周六' },
    { value: 'sun', label: '周日' },
  ]
</script>

<template>
  <CheckboxGroup v-model="days" :options="options" orientation="horizontal" aria-label="更新日" />
</template>
