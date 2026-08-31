<script setup lang="ts">
  import { ExternalLink, Pencil, Share2, Trash2 } from '@lucide/vue'
  import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@hikarinagi/ui'
</script>

<template>
  <DropdownMenu label="Items">
    <Button variant="outline" tone="neutral">Items</Button>
    <template #content>
      <DropdownMenuItem>
        <template #icon>
          <Pencil />
        </template>
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem>
        <template #icon>
          <Share2 />
        </template>
        Share
        <template #trailing>
          <ExternalLink class="text-faint size-3.5" />
        </template>
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
