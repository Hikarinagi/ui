<script setup lang="ts">
  import { ref } from 'vue'
  import { Bold, Italic, Undo2, Redo2 } from '@lucide/vue'
  import {
    Toolbar,
    ToolbarButton,
    ToolbarToggleGroup,
    ToolbarToggleItem,
    ToolbarSeparator,
    Stack,
    FormField,
    Switch,
  } from '@hina-ui/vue'

  const disabled = ref(false)
  const groupDisabled = ref(false)
  const formats = ref(['bold'])
</script>

<template>
  <Stack align="start">
    <FormField label="禁用全部" orientation="horizontal"><Switch v-model="disabled" /></FormField>
    <FormField label="禁用切换组" orientation="horizontal">
      <Switch v-model="groupDisabled" />
    </FormField>
    <Toolbar label="禁用状态" :disabled="disabled" size="sm">
      <ToolbarButton label="撤销"><Undo2 /></ToolbarButton>
      <ToolbarButton label="重做" disabled><Redo2 /></ToolbarButton>
      <ToolbarSeparator />
      <ToolbarToggleGroup v-model="formats" type="multiple" label="格式" :disabled="groupDisabled">
        <ToolbarToggleItem value="bold" label="加粗"><Bold /></ToolbarToggleItem>
        <ToolbarToggleItem value="italic" label="斜体"><Italic /></ToolbarToggleItem>
      </ToolbarToggleGroup>
    </Toolbar>
  </Stack>
</template>
