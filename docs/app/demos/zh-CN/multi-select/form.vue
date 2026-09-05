<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, MultiSelect, Text } from '@hina-ui/vue'

  const genres = [
    { label: '恋爱', value: 'romance' },
    { label: '悬疑', value: 'mystery' },
    { label: '奇幻', value: 'fantasy' },
    { label: '日常', value: 'slice-of-life' },
    { label: '科幻', value: 'sci-fi' },
  ]

  const schema = v.object({
    genres: v.pipe(
      v.array(v.string('请选择题材')),
      v.minLength(1, '至少选择一个题材'),
      v.maxLength(3, '最多选择三个题材'),
    ),
  })

  const values = reactive({ genres: [] as Array<string | number> })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="genres" label="题材" description="一到三个" required>
      <MultiSelect v-model="values.genres" :options="genres" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
