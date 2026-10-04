<script setup lang="ts">
  import { ref } from 'vue'
  import { Center, ContextMenu, ContextMenuItem, Stack, Switch, Text } from '@hina-ui/vue'

  const locked = ref(false)
</script>

<template>
  <Stack gap="md" align="start">
    <Switch v-model="locked">锁定区域</Switch>
    <ContextMenu label="条目操作" :disabled="locked">
      <Center class="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
        <Text tone="muted" size="sm">
          {{ locked ? '已锁定，右键是浏览器自己的菜单' : '在这里点击右键' }}
        </Text>
      </Center>
      <template #content>
        <ContextMenuItem>编辑</ContextMenuItem>
        <ContextMenuItem disabled>移动</ContextMenuItem>
        <ContextMenuItem tone="danger">删除</ContextMenuItem>
      </template>
    </ContextMenu>
  </Stack>
</template>
