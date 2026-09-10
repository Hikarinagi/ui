<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input, Stack } from '@hina-ui/vue'
  const name = ref('Hina')
</script>
<template>
  <Stack class="w-full max-w-2xl resize-x overflow-auto p-2">
    <FormField
      label="显示名称"
      orientation="responsive"
      description="拖动容器右下角调整宽度；字段宽度小于 32rem 时纵向排列。"
    >
      <Input v-model="name" />
    </FormField>
  </Stack>
</template>
