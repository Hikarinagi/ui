<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, DateField, Form, FormField, SegmentedControl, Text } from '@hina-ui/vue'

  const modes = [
    { label: '立即发布', value: 'now' },
    { label: '定时发布', value: 'scheduled' },
  ]

  const schema = v.pipe(
    v.object({
      mode: v.picklist(['now', 'scheduled'], '请选择发布方式'),
      publishAt: v.nullable(v.string()),
    }),
    v.forward(
      v.check(input => input.mode !== 'scheduled' || !!input.publishAt, '请选择发布日期'),
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
    <FormField name="mode" label="发布方式">
      <SegmentedControl v-model="values.mode" :options="modes" />
    </FormField>
    <FormField name="publishAt" label="发布日期" :disabled="values.mode !== 'scheduled'">
      <DateField v-model="values.publishAt" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">发布</Button>
    <Text v-if="saved" tone="muted" size="sm">已发布：{{ saved }}</Text>
  </Form>
</template>
