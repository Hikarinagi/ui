<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Text, Textarea } from '@hina-ui/vue'

  const schema = v.object({
    review: v.pipe(
      v.string('Write a review'),
      v.trim(),
      v.minLength(20, 'At least 20 characters'),
      v.maxLength(500, 'At most 500 characters'),
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
    <FormField name="review" label="Review" description="20 to 500 characters" required>
      <Textarea v-model="values.review" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Post</Button>
    <Text v-if="saved" tone="muted" size="sm">Review posted.</Text>
  </Form>
</template>
