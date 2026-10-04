<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Slider, Text } from '@hina-ui/vue'

  const schema = v.object({
    quality: v.pipe(v.number(), v.minValue(60, '画质不能低于 60')),
  })

  const values = reactive({ quality: 40 })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="quality" label="导出画质" description="60 以下的画质会明显失真">
      <Slider v-model="values.quality" :min="0" :max="100" :step="5" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">导出</Button>
    <Text v-if="saved" tone="muted" size="sm">已导出：{{ saved }}</Text>
  </Form>
</template>
