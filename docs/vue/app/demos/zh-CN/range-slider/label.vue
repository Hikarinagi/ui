<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeSlider, Stack } from '@hina-ui/vue'

  const discount = ref<[number, number]>([20, 60])
  const hidden = ref<[number, number]>([30, 70])
</script>

<template>
  <Stack gap="lg" class="w-64 pt-6">
    <RangeSlider
      v-model="discount"
      label="always"
      :format="(v: number) => `${v}%`"
      aria-label="折扣区间"
    />
    <RangeSlider v-model="hidden" label="none" aria-label="不显示标签" />
  </Stack>
</template>
