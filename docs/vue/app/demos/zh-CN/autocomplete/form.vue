<script setup lang="ts">
  import { computed, reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Autocomplete, Button, Form, FormField, Text } from '@hina-ui/vue'

  const form = ref<InstanceType<typeof Form>>()
  const values = reactive({ framework: '' })
  const saved = ref('')
  const candidates = ['Vue', 'React', 'Svelte', 'Solid', 'Angular']
  const options = computed(() =>
    candidates
      .filter(label => label.toLowerCase().includes(values.framework.toLowerCase()))
      .map(label => ({ value: label, label })),
  )
  const schema = v.object({
    framework: v.pipe(v.string(), v.trim(), v.nonEmpty('请输入框架名称')),
  })

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = (data as { framework: string }).framework
  }
</script>

<template>
  <Form
    ref="form"
    v-slot="{ submitting }"
    :values="values"
    :rules="schema"
    class="w-full max-w-sm"
    @submit="save"
  >
    <FormField
      name="framework"
      label="主要框架"
      description="选择建议，也可以填写其他框架。"
      required
    >
      <Autocomplete
        v-model="values.framework"
        :options="options"
        name="framework"
        placeholder="选择或输入框架名称"
        @submit="form?.submit()"
      />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" role="status" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
