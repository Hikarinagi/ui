<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Text, TimeField } from '@hina-ui/vue'

  const schema = v.object({
    opensAt: v.pipe(
      v.string('请填写开门时间'),
      v.check(value => value >= '06:00', '开门不早于 06:00'),
    ),
  })

  const values = reactive({ opensAt: null as string | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="opensAt" label="开门时间" required>
      <TimeField v-model="values.opensAt" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
