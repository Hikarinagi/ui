<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Text, TreeSelect } from '@hina-ui/vue'
  import { regions } from './data'

  const schema = v.object({
    department: v.string('请选择地区'),
  })

  const values = reactive({ department: null as string | number | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="department" label="所在地区" required>
      <TreeSelect v-model="values.department" :items="regions" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
