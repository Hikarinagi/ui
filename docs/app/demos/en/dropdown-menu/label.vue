<script setup lang="ts">
  import {
    Button,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
  } from '@hikarinagi/ui'
</script>

<template>
  <DropdownMenu label="Account">
    <Button variant="outline" tone="neutral">Shion Hoshimi</Button>
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
