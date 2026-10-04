<script setup lang="ts">
  import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarLink } from '@hina-ui/vue'
</script>

<template>
  <Toolbar label="RTL toolbar" dir="rtl" size="sm">
    <ToolbarButton>First</ToolbarButton>
    <ToolbarButton>Second</ToolbarButton>
    <ToolbarSeparator />
    <ToolbarLink href="#api">API</ToolbarLink>
  </Toolbar>
</template>
