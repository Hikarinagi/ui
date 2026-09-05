<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Combobox, Form, FormField, Text } from '@hina-ui/vue'

  const cities = [
    { label: '东京', value: 'tokyo' },
    { label: '大阪', value: 'osaka' },
    { label: '京都', value: 'kyoto' },
    { label: '札幌', value: 'sapporo' },
    { label: '福冈', value: 'fukuoka' },
  ]

  const schema = v.object({
    city: v.pipe(v.string('请选择城市'), v.nonEmpty('请选择城市')),
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
    <FormField name="city" label="所在城市" required>
      <Combobox v-model="values.city" :options="cities" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
