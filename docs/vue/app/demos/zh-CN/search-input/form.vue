<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, SearchInput, Text } from '@hina-ui/vue'

  const schema = v.object({
    keyword: v.pipe(
      v.string('请输入关键字'),
      v.trim(),
      v.nonEmpty('请输入关键字'),
      v.minLength(2, '关键字至少 2 个字'),
    ),
  })

  const values = reactive({ keyword: '' })
  const result = ref('')

  async function search(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    result.value = (data as { keyword: string }).keyword
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="search">
    <FormField name="keyword" label="搜索作品">
      <SearchInput v-model="values.keyword" placeholder="作品名或者别名" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">搜索</Button>
    <Text v-if="result" tone="muted" size="sm">正在搜索「{{ result }}」的结果。</Text>
  </Form>
</template>
