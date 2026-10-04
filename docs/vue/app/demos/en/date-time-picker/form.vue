<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, DateTimePicker, Form, FormField, Text } from '@hina-ui/vue'

  const schema = v.object({
    startsAt: v.string('Pick a start time'),
  })

  const values = reactive({ startsAt: null as string | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="startsAt" label="Starts at" required>
      <DateTimePicker v-model="values.startsAt" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
