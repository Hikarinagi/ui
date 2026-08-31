<script setup lang="ts">
  import { Download, Share2 } from '@lucide/vue'
  import {
    Button,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
  } from '@hikarinagi/ui'
</script>

<template>
  <DropdownMenu label="File actions" align="start">
    <Button variant="outline" tone="neutral">File</Button>
    <template #content>
      <DropdownMenuItem>Rename</DropdownMenuItem>
      <DropdownMenuSub label="Share with">
        <template #icon>
          <Share2 />
        </template>
        <DropdownMenuItem>Copy link</DropdownMenuItem>
        <DropdownMenuItem>Send by email</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Invite a collaborator</DropdownMenuItem>
      </DropdownMenuSub>
      <DropdownMenuSub label="Export as">
        <template #icon>
          <Download />
        </template>
        <DropdownMenuItem>PDF</DropdownMenuItem>
        <DropdownMenuItem>EPUB</DropdownMenuItem>
        <DropdownMenuItem>Plain text</DropdownMenuItem>
      </DropdownMenuSub>
    </template>
  </DropdownMenu>
</template>
