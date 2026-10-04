<script setup lang="ts">
  import { Editable, FormField, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Editable size="sm" model-value="小号文本" aria-label="小号" />
    <Editable size="md" model-value="默认文本" aria-label="默认" />
    <Editable size="lg" model-value="大号文本" aria-label="大号" />
    <FormField label="只读" description="内容可以选择与复制。">
      <Editable model-value="只读项目名称" readonly />
    </FormField>
    <FormField label="禁用">
      <Editable model-value="暂时无法修改" disabled />
    </FormField>
    <FormField label="尚未填写">
      <Editable placeholder="添加备注…" />
    </FormField>
  </Stack>
</template>
