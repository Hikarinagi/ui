<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Select, Switch, Text, Textarea } from '@hina-ui/vue'

  const schema = v.object({
    title: v.pipe(
      v.string('请输入标题'),
      v.nonEmpty('请输入标题'),
      v.maxLength(20, '标题不超过 20 个字'),
    ),
    category: v.pipe(v.string('请选择分类'), v.nonEmpty('请选择分类')),
    summary: v.pipe(v.string('请输入简介'), v.maxLength(80, '简介不超过 80 个字')),
    published: v.boolean('请选择是否公开'),
  })

  const categories = [
    { label: '游戏', value: 'game' },
    { label: '小说', value: 'novel' },
    { label: '漫画', value: 'manga' },
  ]

  const values = reactive({
    title: '',
    category: null as string | number | null,
    summary: '',
    published: true,
  })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 800))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="title" label="标题" required>
      <Input v-model="values.title" placeholder="作品名称" />
    </FormField>
    <FormField name="category" label="分类" required>
      <Select v-model="values.category" :options="categories" />
    </FormField>
    <FormField name="summary" label="简介" description="不超过 80 个字">
      <Textarea v-model="values.summary" />
    </FormField>
    <FormField name="published">
      <Switch v-model="values.published">公开显示</Switch>
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">提交</Button>
    <Text v-if="saved" tone="muted" size="sm">已提交：{{ saved }}</Text>
  </Form>
</template>
