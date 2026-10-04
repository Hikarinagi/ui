<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, MultiCombobox, Text } from '@hina-ui/vue'

  const tags = [
    { label: '恋爱', value: 'romance' },
    { label: '恋爱喜剧', value: 'rom-com' },
    { label: '校园', value: 'school' },
    { label: '异世界', value: 'isekai' },
    { label: '治愈', value: 'healing' },
    { label: '悬疑', value: 'mystery' },
  ]

  const schema = v.object({
    tags: v.pipe(
      v.array(v.string('请选择标签')),
      v.minLength(1, '至少选择一个标签'),
      v.maxLength(3, '最多选择三个标签'),
    ),
  })

  const values = reactive({ tags: [] as Array<string | number> })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="tags" label="标签" description="一到三个" required>
      <MultiCombobox v-model="values.tags" :options="tags" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
