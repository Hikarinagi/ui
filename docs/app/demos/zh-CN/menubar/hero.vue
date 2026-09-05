<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Kbd,
    Menubar,
    MenubarCheckboxItem,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarSub,
    Stack,
    Text,
  } from '@hina-ui/vue'

  const last = ref('')
  const wrap = ref(true)
  const numbers = ref(false)
  const theme = ref('system')
</script>

<template>
  <Stack gap="sm" align="start">
    <Menubar label="编辑器菜单">
      <MenubarMenu label="文件">
        <MenubarItem @select="last = '新建'">
          新建
          <template #trailing><Kbd>Ctrl N</Kbd></template>
        </MenubarItem>
        <MenubarItem @select="last = '打开'">
          打开
          <template #trailing><Kbd>Ctrl O</Kbd></template>
        </MenubarItem>
        <MenubarSub label="最近打开">
          <MenubarItem @select="last = '第一章.md'">第一章.md</MenubarItem>
          <MenubarItem @select="last = '大纲.md'">大纲.md</MenubarItem>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem @select="last = '保存'">
          保存
          <template #trailing><Kbd>Ctrl S</Kbd></template>
        </MenubarItem>
      </MenubarMenu>
      <MenubarMenu label="编辑">
        <MenubarItem @select="last = '撤销'">
          撤销
          <template #trailing><Kbd>Ctrl Z</Kbd></template>
        </MenubarItem>
        <MenubarItem @select="last = '重做'">
          重做
          <template #trailing><Kbd>Ctrl Y</Kbd></template>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @select="last = '查找'">
          查找
          <template #trailing><Kbd>Ctrl F</Kbd></template>
        </MenubarItem>
      </MenubarMenu>
      <MenubarMenu label="视图">
        <MenubarCheckboxItem v-model:checked="wrap">自动换行</MenubarCheckboxItem>
        <MenubarCheckboxItem v-model:checked="numbers">显示行号</MenubarCheckboxItem>
        <MenubarSeparator />
        <MenubarRadioGroup v-model="theme">
          <MenubarRadioItem value="light">浅色</MenubarRadioItem>
          <MenubarRadioItem value="dark">深色</MenubarRadioItem>
          <MenubarRadioItem value="system">跟随系统</MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarMenu>
    </Menubar>
    <Text v-if="last" tone="muted" size="sm">选择了：{{ last }}</Text>
  </Stack>
</template>
