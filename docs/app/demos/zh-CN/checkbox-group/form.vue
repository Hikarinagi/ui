<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, CheckboxGroup, Form, FormField, Text } from '@hina-ui/vue'

  const options = [
    { label: '游戏', value: 'game' },
    { label: '小说', value: 'novel' },
    { label: '漫画', value: 'manga' },
    { label: '动画', value: 'anime' },
  ]

  const schema = v.object({
    interests: v.pipe(
      v.array(v.string('请选择兴趣')),
      v.minLength(1, '至少选择一项'),
      v.maxLength(2, '最多选择两项'),
    ),
  })

  const values = reactive({ interests: [] as Array<string | number> })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="interests" label="兴趣" description="选一到两项" required>
      <CheckboxGroup v-model="values.interests" :options="options" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
