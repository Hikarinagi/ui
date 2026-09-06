<script setup lang="ts">
  import { Progress } from '@hina-ui/vue'

  const format = (value: number, max: number) => `${value} / ${max} 个文件`
</script>

<template>
  <Progress :value="3" :max="8" label="已处理" show-value :format="format" class="w-80" />
</template>
