<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, DateRangePicker, Form, FormField, Text, type DateRangeValue } from '@hina-ui/vue'

  const schema = v.object({
    trip: v.pipe(
      v.nullable(v.object({ start: v.nullable(v.string()), end: v.nullable(v.string()) })),
      v.check(value => !!value?.start && !!value?.end, 'Pick the whole trip'),
    ),
  })

  const values = reactive({ trip: null as DateRangeValue | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="trip" label="Trip dates" required>
      <DateRangePicker v-model="values.trip" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
