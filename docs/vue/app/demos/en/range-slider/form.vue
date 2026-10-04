<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, RangeSlider, Text } from '@hina-ui/vue'

  const schema = v.object({
    budget: v.pipe(
      v.tuple([v.number(), v.number()]),
      v.check(([low, high]) => high - low >= 200, 'The budget range must span at least 200'),
    ),
  })

  const values = reactive({ budget: [300, 400] as [number, number] })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="budget" label="Budget" description="Drag both ends to set the range">
      <RangeSlider v-model="values.budget" :min="0" :max="1000" :step="50" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
