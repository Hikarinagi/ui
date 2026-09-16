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
    <FormField label="Disable all" orientation="horizontal">
      <Switch v-model="disabled" />
    </FormField>
    <FormField label="Disable toggle group" orientation="horizontal">
      <Switch v-model="groupDisabled" />
    </FormField>
    <Toolbar label="Disabled state" :disabled="disabled" size="sm">
      <ToolbarButton label="Undo"><Undo2 /></ToolbarButton>
      <ToolbarButton label="Redo" disabled><Redo2 /></ToolbarButton>
      <ToolbarSeparator />
      <ToolbarToggleGroup
        v-model="formats"
        type="multiple"
        label="Formatting"
        :disabled="groupDisabled"
      >
        <ToolbarToggleItem value="bold" label="Bold"><Bold /></ToolbarToggleItem>
        <ToolbarToggleItem value="italic" label="Italic"><Italic /></ToolbarToggleItem>
      </ToolbarToggleGroup>
    </Toolbar>
  </Stack>
</template>
