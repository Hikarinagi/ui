<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, DateRangePicker, Form, FormField, Text, type DateRangeValue } from '@hina-ui/vue'

  const schema = v.object({
    trip: v.pipe(
      v.nullable(v.object({ start: v.nullable(v.string()), end: v.nullable(v.string()) })),
      v.check(value => !!value?.start && !!value?.end, '请选择完整的出行日期'),
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
    <FormField name="trip" label="出行日期" required>
      <DateRangePicker v-model="values.trip" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
