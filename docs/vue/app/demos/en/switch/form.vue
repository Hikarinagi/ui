<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Switch, Text } from '@hina-ui/vue'

  const schema = v.pipe(
    v.object({
      isPublic: v.boolean(),
      summary: v.string(),
    }),
    v.forward(
      v.check(
        input => !input.isPublic || input.summary.trim().length > 0,
        'A public work needs a summary',
      ),
      ['summary'],
    ),
  )

  const values = reactive({ isPublic: true, summary: '' })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="isPublic">
      <Switch v-model="values.isPublic">Public</Switch>
    </FormField>
    <FormField name="summary" label="Summary">
      <Input v-model="values.summary" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
