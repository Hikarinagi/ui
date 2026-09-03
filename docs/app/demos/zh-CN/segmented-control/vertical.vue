<script setup lang="ts">
  import { ref } from 'vue'
  import { SegmentedControl } from '@hina-ui/vue'

  const align = ref('left')
  const options = [
    { value: 'left', label: '左对齐' },
    { value: 'center', label: '居中' },
    { value: 'right', label: '右对齐' },
  ]
</script>

<template>
  <SegmentedControl v-model="align" :options="options" orientation="vertical" aria-label="对齐" />
</template>
