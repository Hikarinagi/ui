<script setup lang="ts">
  import { Collapsible, CollapsibleContent, CollapsibleTrigger, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Collapsible disabled class="w-full max-w-md">
    <Stack gap="sm" align="start">
      <CollapsibleTrigger>编辑记录（需要登录）</CollapsibleTrigger>
      <CollapsibleContent>
        <Text tone="muted" size="sm">这段内容不会被展开。</Text>
      </CollapsibleContent>
    </Stack>
  </Collapsible>
</template>
