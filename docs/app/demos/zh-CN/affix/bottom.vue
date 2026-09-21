<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import {
    Affix,
    Button,
    Card,
    FormField,
    Heading,
    Inline,
    Input,
    ScrollArea,
    Stack,
    Text,
    Textarea,
  } from '@hina-ui/vue'

  const draft = reactive({ title: '组件设计回顾', author: '设计团队', summary: '', notes: '' })
  const saved = ref(false)
  watch(draft, () => {
    saved.value = false
  })
</script>

<template>
  <Card :padded="false" class="w-full max-w-xl">
    <ScrollArea class="h-96" :shadow="false" focusable label="编辑文章">
      <Stack class="p-4" gap="lg">
        <Heading :level="3" size="base">编辑文章</Heading>
        <FormField label="标题"><Input v-model="draft.title" /></FormField>
        <FormField label="作者"><Input v-model="draft.author" /></FormField>
        <FormField label="摘要" description="在列表中展示的一段简短介绍。">
          <Textarea v-model="draft.summary" :rows="4" placeholder="这一篇主要讨论什么？" />
        </FormField>
        <FormField label="编辑备注" description="为下一位编辑保留上下文。">
          <Textarea v-model="draft.notes" :rows="4" placeholder="补充修改原因或待确认事项" />
        </FormField>
        <Affix position="bottom" :offset="12">
          <Card class="p-3">
            <Inline align="center" justify="between" gap="sm" wrap>
              <Text role="status" size="sm" tone="muted">
                {{ saved ? '草稿已保存在当前示例' : '修改仅保留在当前示例' }}
              </Text>
              <Button size="sm" :disabled="!draft.title.trim() || saved" @click="saved = true">
                保存草稿
              </Button>
            </Inline>
          </Card>
        </Affix>
      </Stack>
    </ScrollArea>
  </Card>
</template>
