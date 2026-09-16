<script setup lang="ts">
  import { Stepper } from '@hina-ui/vue'

  const items = [
    { title: '步骤 A', description: '第一项的说明' },
    { title: '步骤 B', description: '第二项包含更长的说明文字，支持自然换行' },
    { title: '步骤 C', description: '最后一项的说明' },
  ]
</script>

<template>
  <Stepper :items="items" :default-value="2" orientation="vertical" class="max-w-md" />
</template>
