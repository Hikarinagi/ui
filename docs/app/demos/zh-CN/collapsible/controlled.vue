<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Button,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    Inline,
    Stack,
    Text,
  } from '@hikarinagi/ui'

  const open = ref(false)
</script>

<template>
  <Stack class="w-full max-w-md">
    <Inline>
      <Button size="sm" variant="soft" tone="neutral" @click="open = !open">
        {{ open ? '收起' : '展开' }}
      </Button>
      <Text tone="muted" size="sm">open：{{ open }}</Text>
    </Inline>
    <Collapsible v-model:open="open">
      <Stack gap="sm" align="start">
        <CollapsibleTrigger>组件自己的触发器</CollapsibleTrigger>
        <CollapsibleContent>
          <Text tone="muted" size="sm">两处触发器操作的是同一个状态。</Text>
        </CollapsibleContent>
      </Stack>
    </Collapsible>
  </Stack>
</template>
