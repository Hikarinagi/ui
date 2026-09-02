<script setup lang="ts">
  import { Copy, Download, Pencil, Trash2 } from '@lucide/vue'
  import {
    Button,
    DisclosureIcon,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuSeparator,
  } from '@hikarinagi/ui'
</script>

<template>
  <DropdownMenu label="File actions" align="start">
    <Button variant="outline" tone="neutral">
      File
      <template #trailing>
        <DisclosureIcon />
      </template>
    </Button>
    <template #content>
      <DropdownMenuItem>
        <template #icon>
          <Pencil />
        </template>
        Rename
      </DropdownMenuItem>
      <DropdownMenuItem>
        <template #icon>
          <Copy />
        </template>
        Copy
      </DropdownMenuItem>
      <DropdownMenuItem>
        <template #icon>
          <Download />
        </template>
        Download
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem tone="danger">
        <template #icon>
          <Trash2 />
        </template>
        Delete
      </DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
