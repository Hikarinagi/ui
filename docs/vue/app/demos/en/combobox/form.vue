<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Combobox, Form, FormField, Text } from '@hina-ui/vue'

  const cities = [
    { label: 'Tokyo', value: 'tokyo' },
    { label: 'Osaka', value: 'osaka' },
    { label: 'Kyoto', value: 'kyoto' },
    { label: 'Sapporo', value: 'sapporo' },
    { label: 'Fukuoka', value: 'fukuoka' },
  ]

  const schema = v.object({
    city: v.pipe(v.string('Pick a city'), v.nonEmpty('Pick a city')),
  })

  const values = reactive({ city: null as string | number | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="city" label="City" required>
      <Combobox v-model="values.city" :options="cities" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
