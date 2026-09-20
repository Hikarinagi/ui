<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { DropdownMenuItem, Form, FormField, Input, SplitButton, Text } from '@hina-ui/vue'

  const values = reactive({ title: '' })
  const result = ref('')
  const schema = v.object({
    title: v.pipe(v.string(), v.trim(), v.minLength(2, '标题至少需要 2 个字')),
  })

  async function publish(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 800))
    result.value = `已发布：${(data as { title: string }).title}`
  }
  function saveDraft() {
    result.value = `已保存草稿：${values.title.trim() || '未命名文章'}`
  }
</script>

<template>
  <Form
    v-slot="{ submitting }"
    :values="values"
    :rules="schema"
    class="w-full max-w-sm"
    @submit="publish"
  >
    <FormField
      name="title"
      label="文章标题"
      description="发布前校验标题，保存草稿可以保留未完成内容。"
      required
    >
      <Input v-model="values.title" placeholder="填写标题" />
    </FormField>
    <SplitButton type="submit" :loading="submitting" menu-label="其他保存方式" class="self-start">
      发布文章
      <template #content>
        <DropdownMenuItem @select="saveDraft">保存草稿</DropdownMenuItem>
      </template>
    </SplitButton>
    <Text v-if="result" role="status" size="sm" tone="muted">{{ result }}</Text>
  </Form>
</template>
