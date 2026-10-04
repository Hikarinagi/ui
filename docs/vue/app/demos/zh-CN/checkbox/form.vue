<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Checkbox, Form, FormField, Text } from '@hina-ui/vue'

  const schema = v.object({
    agreed: v.literal(true, '请先阅读并同意服务条款'),
  })

  const values = reactive({ agreed: false as boolean | 'indeterminate' })
  const saved = ref(false)

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = true
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="agreed">
      <Checkbox v-model="values.agreed">我已阅读并同意服务条款</Checkbox>
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">注册</Button>
    <Text v-if="saved" tone="muted" size="sm">已注册。</Text>
  </Form>
</template>
