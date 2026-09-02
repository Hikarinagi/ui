<script setup lang="ts">
  import { Copy, Scissors, Trash2 } from '@lucide/vue'
  import { Button, DropdownMenu, DropdownMenuItem, Kbd } from '@hina-ui/vue'
</script>

<template>
  <DropdownMenu label="Edit">
    <Button variant="outline" tone="neutral">Edit</Button>
    <template #content>
      <DropdownMenuItem>
        <template #icon>
          <Copy />
        </template>
        Copy
        <template #trailing>
          <Kbd>Ctrl C</Kbd>
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <template #icon>
          <Scissors />
        </template>
        Cut
        <template #trailing>
          <Kbd>Ctrl X</Kbd>
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem tone="danger">
        <template #icon>
          <Trash2 />
        </template>
        Delete
        <template #trailing>
          <Kbd>Del</Kbd>
        </template>
      </DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
