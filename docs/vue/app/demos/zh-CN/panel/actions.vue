<script setup lang="ts">
  import { Button, Panel, Text } from '@hina-ui/vue'
</script>

<template>
  <Panel title="邮件通知" class="w-96">
    <template #actions>
      <Button size="sm" variant="outline" tone="neutral">测试发送</Button>
      <Button size="sm">保存</Button>
    </template>
    <Text>有新的回复、关注与私信时发送邮件。</Text>
  </Panel>
</template>
