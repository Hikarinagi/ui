<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, NumberInput, Text } from '@hina-ui/vue'

  const schema = v.object({
    price: v.pipe(
      v.number('请输入价格'),
      v.minValue(1, '价格至少 1 元'),
      v.maxValue(9999, '价格不超过 9999 元'),
    ),
  })

  const values = reactive({ price: null as number | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="price" label="价格" description="1 到 9999 元" required>
      <NumberInput v-model="values.price" :min="0" :step="1" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">上架</Button>
    <Text v-if="saved" tone="muted" size="sm">已上架：{{ saved }}</Text>
  </Form>
</template>
