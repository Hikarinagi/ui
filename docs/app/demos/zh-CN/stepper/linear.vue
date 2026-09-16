<script setup lang="ts">
  import { ref } from 'vue'
  import { Stepper, Stack, Switch } from '@hina-ui/vue'

  const linear = ref(true)
  const items = [
    { title: '步骤 A', description: '第一项的说明' },
    { title: '步骤 B', description: '第二项包含更长的说明文字，支持自然换行' },
    { title: '步骤 C', description: '最后一项的说明' },
  ]
</script>

<template>
  <Stack class="w-full" gap="lg">
    <Switch v-model="linear">线性切换</Switch>
    <Stepper :items="items" :linear="linear" />
  </Stack>
</template>
