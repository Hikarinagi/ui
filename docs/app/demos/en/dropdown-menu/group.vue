<script setup lang="ts">
  import {
    Avatar,
    Button,
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
  } from '@hikarinagi/ui'
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
      <DropdownMenuGroup>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Preferences</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
        <DropdownMenuItem>Members</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
      </DropdownMenuGroup>
    </template>
  </DropdownMenu>
</template>
