<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Input, Stack, Switch, Text, vTooltip } from '@hina-ui/vue'

  const content = ref('提示文字')
  const disabled = ref(false)
</script>

<template>
  <Stack align="start">
    <Inline>
      <Button v-tooltip="'直接绑定已有元素'" variant="outline" tone="neutral">字符串</Button>
      <Button v-tooltip="{ content, side: 'bottom', disabled }" variant="outline" tone="neutral">
        对象配置
      </Button>
    </Inline>
    <Input v-model="content" aria-label="提示文字" class="w-64" />
    <Inline>
      <Switch v-model="disabled" aria-label="禁用对象提示" />
      <Text>禁用对象提示</Text>
    </Inline>
  </Stack>
</template>
