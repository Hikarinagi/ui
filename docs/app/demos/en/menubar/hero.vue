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
    <Menubar label="Editor menu">
      <MenubarMenu label="File">
        <MenubarItem @select="last = 'New'">
          New
          <template #trailing><Kbd>Ctrl N</Kbd></template>
        </MenubarItem>
        <MenubarItem @select="last = 'Open'">
          Open
          <template #trailing><Kbd>Ctrl O</Kbd></template>
        </MenubarItem>
        <MenubarSub label="Open recent">
          <MenubarItem @select="last = 'chapter-1.md'">chapter-1.md</MenubarItem>
          <MenubarItem @select="last = 'outline.md'">outline.md</MenubarItem>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem @select="last = 'Save'">
          Save
          <template #trailing><Kbd>Ctrl S</Kbd></template>
        </MenubarItem>
      </MenubarMenu>
      <MenubarMenu label="Edit">
        <MenubarItem @select="last = 'Undo'">
          Undo
          <template #trailing><Kbd>Ctrl Z</Kbd></template>
        </MenubarItem>
        <MenubarItem @select="last = 'Redo'">
          Redo
          <template #trailing><Kbd>Ctrl Y</Kbd></template>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @select="last = 'Find'">
          Find
          <template #trailing><Kbd>Ctrl F</Kbd></template>
        </MenubarItem>
      </MenubarMenu>
      <MenubarMenu label="View">
        <MenubarCheckboxItem v-model:checked="wrap">Word wrap</MenubarCheckboxItem>
        <MenubarCheckboxItem v-model:checked="numbers">Line numbers</MenubarCheckboxItem>
        <MenubarSeparator />
        <MenubarRadioGroup v-model="theme">
          <MenubarRadioItem value="light">Light</MenubarRadioItem>
          <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
          <MenubarRadioItem value="system">System</MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarMenu>
    </Menubar>
    <Text v-if="last" tone="muted" size="sm">Picked: {{ last }}</Text>
  </Stack>
</template>
