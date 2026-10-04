<script setup lang="ts">
  import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarLink } from '@hina-ui/vue'
</script>

<template>
  <Toolbar label="RTL 工具栏" dir="rtl" size="sm">
    <ToolbarButton>第一项</ToolbarButton>
    <ToolbarButton>第二项</ToolbarButton>
    <ToolbarSeparator />
    <ToolbarLink href="#api">API</ToolbarLink>
  </Toolbar>
</template>
