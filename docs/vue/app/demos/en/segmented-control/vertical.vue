<script setup lang="ts">
  import { ref } from 'vue'
  import { SegmentedControl } from '@hina-ui/vue'

  const align = ref('left')
  const options = [
    { value: 'left', label: 'Align left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Align right' },
  ]
</script>

<template>
  <SegmentedControl
    v-model="align"
    :options="options"
    orientation="vertical"
    aria-label="Alignment"
  />
</template>
