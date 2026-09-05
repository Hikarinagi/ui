<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Menubar, MenubarItem, MenubarMenu, Stack, Text } from '@hina-ui/vue'

  const open = ref('')
</script>

<template>
  <Stack gap="md" align="start">
    <Inline gap="sm">
      <Button variant="outline" tone="neutral" @click="open = 'file'">展开「文件」</Button>
      <Button variant="outline" tone="neutral" @click="open = 'help'">展开「帮助」</Button>
    </Inline>
    <Menubar v-model="open" label="受控菜单">
      <MenubarMenu label="文件" value="file">
        <MenubarItem>新建</MenubarItem>
        <MenubarItem>打开</MenubarItem>
      </MenubarMenu>
      <MenubarMenu label="帮助" value="help">
        <MenubarItem>文档</MenubarItem>
        <MenubarItem>关于</MenubarItem>
      </MenubarMenu>
    </Menubar>
    <Text tone="muted" size="sm">当前展开：{{ open || '无' }}</Text>
  </Stack>
</template>
