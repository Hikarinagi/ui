<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, DatePicker, Form, FormField, Text } from '@hina-ui/vue'

  const schema = v.object({
    released: v.string('请选择发售日期'),
  })

  const values = reactive({ released: null as string | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="released" label="发售日期" required>
      <DatePicker v-model="values.released" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
