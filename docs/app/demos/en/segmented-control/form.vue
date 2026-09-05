<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, DateField, Form, FormField, SegmentedControl, Text } from '@hina-ui/vue'

  const modes = [
    { label: 'Publish now', value: 'now' },
    { label: 'Schedule', value: 'scheduled' },
  ]

  const schema = v.pipe(
    v.object({
      mode: v.picklist(['now', 'scheduled'], 'Pick how to publish'),
      publishAt: v.nullable(v.string()),
    }),
    v.forward(
      v.check(input => input.mode !== 'scheduled' || !!input.publishAt, 'Pick a publish date'),
      ['publishAt'],
    ),
  )

  const values = reactive({
    mode: 'now' as string | number,
    publishAt: null as string | null,
  })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="mode" label="Publishing">
      <SegmentedControl v-model="values.mode" :options="modes" />
    </FormField>
    <FormField name="publishAt" label="Publish date" :disabled="values.mode !== 'scheduled'">
      <DateField v-model="values.publishAt" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Publish</Button>
    <Text v-if="saved" tone="muted" size="sm">Published: {{ saved }}</Text>
  </Form>
</template>
