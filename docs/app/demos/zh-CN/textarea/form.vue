<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Text, Textarea } from '@hina-ui/vue'

  const schema = v.object({
    review: v.pipe(
      v.string('请写下评价'),
      v.trim(),
      v.minLength(20, '评价至少 20 个字'),
      v.maxLength(500, '评价不超过 500 个字'),
    ),
  })

  const values = reactive({ review: '' })
  const saved = ref(false)

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = true
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="review" label="评价" description="20 到 500 个字" required>
      <Textarea v-model="values.review" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">发表</Button>
    <Text v-if="saved" tone="muted" size="sm">评价已发表。</Text>
  </Form>
</template>
