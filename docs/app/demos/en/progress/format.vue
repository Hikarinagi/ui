<script setup lang="ts">
  import { Progress } from '@hina-ui/vue'

  const format = (value: number, max: number) => `${value} of ${max} files`
</script>

<template>
  <Progress :value="3" :max="8" label="Processed" show-value :format="format" class="w-80" />
</template>
