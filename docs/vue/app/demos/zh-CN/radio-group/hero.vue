<script setup lang="ts">
  import { ref } from 'vue'
  import { RadioGroup } from '@hina-ui/vue'

  const status = ref('doing')
  const options = [
    { value: 'wish', label: '想看' },
    { value: 'doing', label: '在看' },
    { value: 'done', label: '看过' },
  ]
</script>

<template>
  <RadioGroup v-model="status" :options="options" aria-label="收藏状态" />
</template>
