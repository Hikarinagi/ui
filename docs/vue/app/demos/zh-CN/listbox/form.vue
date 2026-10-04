<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Listbox, Text } from '@hina-ui/vue'

  const plans = [
    { label: '免费版', value: 'free' },
    { label: '标准版', value: 'standard' },
    { label: '专业版', value: 'pro' },
  ]

  const schema = v.object({
    plan: v.string('请选择套餐'),
  })

  const values = reactive({
    plan: null as string | number | null | Array<string | number>,
  })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="plan" label="套餐" required>
      <Listbox v-model="values.plan" :options="plans" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">订阅</Button>
    <Text v-if="saved" tone="muted" size="sm">已订阅：{{ saved }}</Text>
  </Form>
</template>
