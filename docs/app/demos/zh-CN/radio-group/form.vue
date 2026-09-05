<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, RadioGroup, Text } from '@hina-ui/vue'

  const options = [
    { label: '公开', value: 'public', description: '所有人可见' },
    { label: '仅关注者', value: 'followers', description: '关注你的人可见' },
    { label: '私密', value: 'private', description: '只有自己可见' },
  ]

  const schema = v.object({
    visibility: v.string('请选择可见范围'),
  })

  const values = reactive({ visibility: null as string | number | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="visibility" label="可见范围" required>
      <RadioGroup v-model="values.visibility" :options="options" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">发布</Button>
    <Text v-if="saved" tone="muted" size="sm">已发布：{{ saved }}</Text>
  </Form>
</template>
