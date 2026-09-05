<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, RadioGroup, Text } from '@hina-ui/vue'

  const options = [
    { label: 'Public', value: 'public', description: 'Visible to everyone' },
    { label: 'Followers', value: 'followers', description: 'Visible to people who follow you' },
    { label: 'Private', value: 'private', description: 'Visible only to you' },
  ]

  const schema = v.object({
    visibility: v.string('Pick who can see it'),
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
    <FormField name="visibility" label="Visibility" required>
      <RadioGroup v-model="values.visibility" :options="options" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Publish</Button>
    <Text v-if="saved" tone="muted" size="sm">Published: {{ saved }}</Text>
  </Form>
</template>
