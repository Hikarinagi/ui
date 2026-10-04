<script setup lang="ts">
  import {
    Avatar,
    Button,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
  } from '@hina-ui/vue'
</script>

<template>
  <DropdownMenu label="Account">
    <Button variant="outline" tone="neutral">
      <template #icon>
        <Avatar size="sm" src="/avatars/huh.webp" alt="Shion Hoshimi" />
      </template>
      Shion Hoshimi
    </Button>
    <template #content>
      <DropdownMenuLabel>My account</DropdownMenuLabel>
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Preferences</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Workspace</DropdownMenuLabel>
      <DropdownMenuItem>Members</DropdownMenuItem>
      <DropdownMenuItem>Billing</DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
