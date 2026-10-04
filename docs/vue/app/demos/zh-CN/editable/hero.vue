<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, Editable, FormField, Stack, Text } from '@hina-ui/vue'

  const title = ref('Hina UI 组件库')
  const description = ref('为内容站与管理后台提供一致、克制的交互体验。')
</script>

<template>
  <Card class="w-full max-w-lg">
    <Stack gap="lg">
      <Text weight="medium">项目信息</Text>
      <FormField label="项目名称">
        <Editable v-model="title" :maxlength="60" />
      </FormField>
      <FormField label="简介">
        <Editable v-model="description" multiline :rows="3" />
      </FormField>
      <Text size="sm" tone="muted">
        单击文字修改。回车保存，Esc 取消；多行文本用 Ctrl / ⌘ + Enter 保存。
      </Text>
    </Stack>
  </Card>
</template>
