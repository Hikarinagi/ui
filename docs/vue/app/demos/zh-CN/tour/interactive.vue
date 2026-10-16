<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Input, Text, Tour, type TourStep } from '@hina-ui/vue'

  const open = ref(false)
  const name = ref('')
  const error = ref('')

  const steps: TourStep[] = [
    {
      target: '#tour-interactive-name',
      title: '给项目起个名字',
      description: '在输入框里写下名字，再点「下一步」。',
      interactive: true,
    },
    { target: '#tour-interactive-save', title: '保存', description: '名字会出现在项目列表里。' },
  ]

  async function beforeChange(next: number, previous: number) {
    if (previous !== 1 || next < previous) return true
    await new Promise(resolve => setTimeout(resolve, 600))
    error.value = name.value.trim() ? '' : '名字不能为空'
    return !error.value
  }
</script>

<template>
  <Inline gap="sm" align="center" wrap>
    <Input id="tour-interactive-name" v-model="name" placeholder="项目名称" class="w-56" />
    <Button id="tour-interactive-save">保存</Button>
    <Button variant="ghost" tone="neutral" @click="open = true">开始引导</Button>
  </Inline>
  <Tour v-model:open="open" :steps="steps" :before-change="beforeChange" @finish="error = ''">
    <template #content="{ step }">
      <Text tone="muted" size="sm">{{ step.description }}</Text>
      <Text v-if="error && step.interactive" tone="danger" size="sm">{{ error }}</Text>
    </template>
  </Tour>
</template>
