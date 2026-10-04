<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, NumberInput, Text } from '@hina-ui/vue'

  const schema = v.object({
    price: v.pipe(
      v.number('Enter a price'),
      v.minValue(1, 'The price must be at least 1'),
      v.maxValue(9999, 'The price must be at most 9999'),
    ),
  })

  const values = reactive({ price: null as number | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="price" label="Price" description="1 to 9999" required>
      <NumberInput v-model="values.price" :min="0" :step="1" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">List</Button>
    <Text v-if="saved" tone="muted" size="sm">Listed: {{ saved }}</Text>
  </Form>
</template>
