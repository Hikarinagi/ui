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
  const names: Record<string, string> = { sm: 'small', md: 'medium', lg: 'large' }
</script>

<template>
  <Stack gap="sm" align="start">
    <Menubar label="View settings">
      <MenubarMenu label="View">
        <MenubarCheckboxItem v-model:checked="wrap">Word wrap</MenubarCheckboxItem>
        <MenubarCheckboxItem v-model:checked="numbers">Line numbers</MenubarCheckboxItem>
        <MenubarSeparator />
        <MenubarLabel>Font size</MenubarLabel>
        <MenubarRadioGroup v-model="size">
          <MenubarRadioItem value="sm">Small</MenubarRadioItem>
          <MenubarRadioItem value="md">Medium</MenubarRadioItem>
          <MenubarRadioItem value="lg">Large</MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarMenu>
    </Menubar>
    <Text tone="muted" size="sm">
      Word wrap {{ wrap ? 'on' : 'off' }}, line numbers {{ numbers ? 'on' : 'off' }}, font size
      {{ names[size] }}
    </Text>
  </Stack>
</template>
