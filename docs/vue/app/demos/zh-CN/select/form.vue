<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Select, Text } from '@hina-ui/vue'

  const categories = [
    { label: '游戏', value: 'game' },
    { label: '小说', value: 'novel' },
    { label: '漫画', value: 'manga' },
  ]

  const schema = v.object({
    category: v.pipe(v.string('请选择分类'), v.nonEmpty('请选择分类')),
  })

  const values = reactive({ category: null as string | number | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="category" label="分类" required>
      <Select v-model="values.category" :options="categories" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
