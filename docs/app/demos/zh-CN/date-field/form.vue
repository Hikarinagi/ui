<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, DateField, Form, FormField, Text } from '@hina-ui/vue'

  const today = new Date().toISOString().slice(0, 10)

  const schema = v.object({
    birthday: v.pipe(
      v.string('请输入出生日期'),
      v.check(value => value <= today, '出生日期不能晚于今天'),
    ),
  })

  const values = reactive({ birthday: null as string | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="birthday" label="出生日期" required>
      <DateField v-model="values.birthday" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
