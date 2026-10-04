<script setup lang="ts">
  import { ref } from 'vue'
  import { RefreshCw } from '@lucide/vue'
  import { Center, FloatButton, FormField, Stack, Switch, Text } from '@hina-ui/vue'

  const visible = ref(true)
  const loading = ref(false)
  const disabled = ref(false)
  const result = ref('显示和隐藏带有过渡')
</script>

<template>
  <Stack class="w-full max-w-xs">
    <FormField label="显示按钮" orientation="horizontal"><Switch v-model="visible" /></FormField>
    <FormField label="加载中" orientation="horizontal"><Switch v-model="loading" /></FormField>
    <FormField label="禁用" orientation="horizontal"><Switch v-model="disabled" /></FormField>
    <Center class="h-24">
      <FloatButton
        position="static"
        label="同步资料"
        :visible="visible"
        :loading="loading"
        :disabled="disabled"
        @click="result = '已执行：同步资料'"
      >
        <RefreshCw />
      </FloatButton>
    </Center>
    <Text role="status" size="sm" tone="muted" class="text-center">{{ result }}</Text>
  </Stack>
</template>
