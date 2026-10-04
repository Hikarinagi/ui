<script setup lang="ts">
  import { Button, DropdownMenu, DropdownMenuItem } from '@hina-ui/vue'
</script>

<template>
  <DropdownMenu label="More actions">
    <Button variant="outline" tone="neutral">More actions</Button>
    <template #content>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem>Copy</DropdownMenuItem>
      <DropdownMenuItem>Archive</DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
