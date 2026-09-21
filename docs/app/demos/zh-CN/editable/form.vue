<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Editable, Form, FormField, Text } from '@hina-ui/vue'

  const values = reactive({ displayName: '' })
  const editing = ref(false)
  const saved = ref('')
  const schema = v.object({
    displayName: v.pipe(v.string(), v.trim(), v.minLength(2, '显示名称至少需要 2 个字')),
  })

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = (data as { displayName: string }).displayName
  }
</script>

<template>
  <Form
    v-slot="{ submitting }"
    :values="values"
    :rules="schema"
    class="w-full max-w-sm"
    @submit="save"
  >
    <FormField
      name="displayName"
      label="显示名称"
      description="先确认字段修改，再保存整份资料。"
      required
    >
      <Editable
        v-model="values.displayName"
        v-model:editing="editing"
        name="displayName"
        placeholder="填写显示名称"
      />
    </FormField>
    <Button type="submit" :loading="submitting" :disabled="editing" class="self-start">
      保存资料
    </Button>
    <Text v-if="saved" role="status" size="sm" tone="muted">已保存：{{ saved }}</Text>
  </Form>
</template>
