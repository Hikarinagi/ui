<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Switch, Text } from '@hina-ui/vue'

  const schema = v.pipe(
    v.object({
      isPublic: v.boolean(),
      summary: v.string(),
    }),
    v.forward(
      v.check(
        input => !input.isPublic || input.summary.trim().length > 0,
        '公开的作品需要填写简介',
      ),
      ['summary'],
    ),
  )

  const values = reactive({ isPublic: true, summary: '' })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="isPublic">
      <Switch v-model="values.isPublic">公开显示</Switch>
    </FormField>
    <FormField name="summary" label="简介">
      <Input v-model="values.summary" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
