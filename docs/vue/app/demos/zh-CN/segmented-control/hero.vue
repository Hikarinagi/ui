<script setup lang="ts">
  import { ref } from 'vue'
  import { SegmentedControl } from '@hina-ui/vue'

  const status = ref('all')
  const options = [
    { value: 'all', label: '全部' },
    { value: 'ongoing', label: '连载中' },
    { value: 'done', label: '已完结' },
  ]
</script>

<template>
  <SegmentedControl v-model="status" :options="options" aria-label="连载状态" />
</template>
