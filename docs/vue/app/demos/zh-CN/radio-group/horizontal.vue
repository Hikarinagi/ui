<script setup lang="ts">
  import { ref } from 'vue'
  import { RadioGroup } from '@hina-ui/vue'

  const sort = ref('updated')
  const options = [
    { value: 'updated', label: '最近更新' },
    { value: 'rating', label: '评分' },
    { value: 'title', label: '标题' },
  ]
</script>

<template>
  <RadioGroup v-model="sort" :options="options" orientation="horizontal" aria-label="排序方式" />
</template>
