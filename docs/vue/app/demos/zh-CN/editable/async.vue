<script setup lang="ts">
  import { ref } from 'vue'
  import { Editable, FormField, Stack, Switch, Text } from '@hina-ui/vue'

  const name = ref('创作者工作台')
  const fail = ref(false)
  const saved = ref(false)

  async function save(value: string) {
    saved.value = false
    if (!value.trim()) throw new Error('工作区名称不能为空')
    await new Promise(resolve => setTimeout(resolve, 800))
    if (fail.value) throw new Error('暂时无法保存，请关闭模拟失败后重试')
    saved.value = true
  }
</script>

<template>
  <Stack class="w-full max-w-sm">
    <FormField label="工作区名称" description="保存完成前保留编辑态，失败后可继续修改或重试。">
      <Editable v-model="name" :on-save="save" submit-mode="enter" />
    </FormField>
    <FormField label="模拟保存失败" orientation="horizontal">
      <Switch v-model="fail" />
    </FormField>
    <Text v-if="saved" role="status" size="sm" tone="muted">工作区名称已保存。</Text>
  </Stack>
</template>
