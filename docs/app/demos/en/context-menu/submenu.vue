<script setup lang="ts">
  import { Center, ContextMenu, ContextMenuItem, ContextMenuSub, Text } from '@hina-ui/vue'
</script>

<template>
  <ContextMenu label="Share">
    <Center class="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
      <Text tone="muted" size="sm">Right-click here</Text>
    </Center>
    <template #content>
      <ContextMenuItem>Copy link</ContextMenuItem>
      <ContextMenuSub label="Share to">
        <ContextMenuItem>Feed</ContextMenuItem>
        <ContextMenuItem>Direct message</ContextMenuItem>
        <ContextMenuSub label="More">
          <ContextMenuItem>Email</ContextMenuItem>
          <ContextMenuItem>QR code</ContextMenuItem>
        </ContextMenuSub>
      </ContextMenuSub>
    </template>
  </ContextMenu>
</template>
