<script setup lang="ts">
  import { Heading, Panel, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="md" class="w-96">
    <Heading :level="2" size="lg">设置</Heading>
    <Panel title="通知" :level="3">
      <Text>这块面板嵌在「设置」之下，标题降为三级。</Text>
    </Panel>
    <Panel title="隐私" :level="3">
      <Text>同一层级的面板用同一级标题。</Text>
    </Panel>
  </Stack>
</template>
