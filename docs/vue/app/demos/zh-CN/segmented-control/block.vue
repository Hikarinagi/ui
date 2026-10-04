<script setup lang="ts">
  import { ref } from 'vue'
  import { SegmentedControl } from '@hina-ui/vue'

  const range = ref('week')
  const options = [
    { value: 'day', label: '今日' },
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'all', label: '全部' },
  ]
</script>

<template>
  <SegmentedControl
    v-model="range"
    :options="options"
    block
    aria-label="统计范围"
    class="max-w-md"
  />
</template>
