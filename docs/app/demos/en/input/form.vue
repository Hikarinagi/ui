<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Text } from '@hina-ui/vue'

  const schema = v.object({
    name: v.pipe(
      v.string('Enter a nickname'),
      v.nonEmpty('Enter a nickname'),
      v.minLength(2, 'At least 2 characters'),
      v.maxLength(12, 'At most 12 characters'),
    ),
  })

  const values = reactive({ name: '' })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="name" label="Nickname" description="2 to 12 characters" required>
      <Input v-model="values.name" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
