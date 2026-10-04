<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Rating, Text } from '@hina-ui/vue'

  const schema = v.object({
    score: v.pipe(v.number(), v.minValue(1, '请先打分')),
  })

  const values = reactive({ score: 0 })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="score" label="评分" required>
      <Rating v-model="values.score" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">提交评价</Button>
    <Text v-if="saved" tone="muted" size="sm">已提交：{{ saved }}</Text>
  </Form>
</template>
