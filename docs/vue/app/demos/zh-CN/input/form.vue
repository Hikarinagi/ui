<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Text } from '@hina-ui/vue'

  const schema = v.object({
    name: v.pipe(
      v.string('请输入昵称'),
      v.nonEmpty('请输入昵称'),
      v.minLength(2, '昵称至少 2 个字'),
      v.maxLength(12, '昵称不超过 12 个字'),
    ),
  })

  const values = reactive({ name: '' })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="name" label="昵称" description="2 到 12 个字" required>
      <Input v-model="values.name" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
