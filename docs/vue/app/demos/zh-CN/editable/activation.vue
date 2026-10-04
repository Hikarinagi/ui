<script setup lang="ts">
  import { reactive } from 'vue'
  import { Editable, FormField, Stack } from '@hina-ui/vue'

  const values = reactive({ double: '双击修改文档标题', manual: '按编辑按钮修改' })
</script>

<template>
  <Stack class="w-full max-w-sm" gap="lg">
    <FormField label="双击进入" description="键盘聚焦后仍可按 Enter 或空格进入。">
      <Editable v-model="values.double" activation-mode="dblclick" />
    </FormField>
    <FormField label="手动进入" description="草稿一直保留到按下保存或取消。">
      <Editable v-model="values.manual" activation-mode="manual" submit-mode="manual" />
    </FormField>
  </Stack>
</template>
