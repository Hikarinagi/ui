<script setup lang="ts">
  import { RangeSlider } from '@hina-ui/vue'
</script>

<template>
  <RangeSlider disabled :model-value="[30, 70]" aria-label="已禁用" class="w-64" />
</template>
