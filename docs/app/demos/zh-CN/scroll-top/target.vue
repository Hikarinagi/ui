<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Card, FormField, ScrollArea, ScrollTop, Stack, Switch, Text } from '@hina-ui/vue'

  const area = ref<InstanceType<typeof ScrollArea>>()
  const show = ref(true)
</script>

<template>
  <Stack class="w-full max-w-md" gap="sm">
    <FormField label="挂载滚动区域" orientation="horizontal"><Switch v-model="show" /></FormField>
    <Button
      variant="outline"
      tone="neutral"
      class="self-start"
      :disabled="!show"
      @click="area?.viewport?.scrollTo({ top: 500, behavior: 'instant' })"
    >
      滚动到中段
    </Button>
    <Card :padded="false" class="relative h-64 overflow-hidden">
      <ScrollArea v-if="show" ref="area" class="h-full" :shadow="false" focusable label="审阅记录">
        <Stack class="p-5 pb-24" gap="lg">
          <Text v-for="i in 20" :key="i" size="sm" class="border-line border-b pb-3">
            审阅记录 {{ i }} · 检查交互与视觉细节
          </Text>
        </Stack>
      </ScrollArea>
      <Text v-else size="sm" tone="muted" class="p-5">滚动区域已卸载</Text>
      <ScrollTop :target="() => area?.viewport" position="absolute" :threshold="120" :offset="16" />
    </Card>
    <Text size="sm" tone="muted">
      回顶组件保持挂载。目标尚未准备好或已卸载时，按钮隐藏，也不会改为滚动页面。
    </Text>
  </Stack>
</template>
