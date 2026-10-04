<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Menubar,
    MenubarCheckboxItem,
    MenubarLabel,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    Stack,
    Text,
  } from '@hina-ui/vue'

  const wrap = ref(true)
  const numbers = ref(false)
  const size = ref('md')
  const names: Record<string, string> = { sm: '小', md: '中', lg: '大' }
</script>

<template>
  <Stack gap="sm" align="start">
    <Menubar label="视图设置">
      <MenubarMenu label="视图">
        <MenubarCheckboxItem v-model:checked="wrap">自动换行</MenubarCheckboxItem>
        <MenubarCheckboxItem v-model:checked="numbers">显示行号</MenubarCheckboxItem>
        <MenubarSeparator />
        <MenubarLabel>字号</MenubarLabel>
        <MenubarRadioGroup v-model="size">
          <MenubarRadioItem value="sm">小</MenubarRadioItem>
          <MenubarRadioItem value="md">中</MenubarRadioItem>
          <MenubarRadioItem value="lg">大</MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarMenu>
    </Menubar>
    <Text tone="muted" size="sm">
      自动换行{{ wrap ? '开' : '关' }}，行号{{ numbers ? '开' : '关' }}，字号{{ names[size] }}
    </Text>
  </Stack>
</template>
