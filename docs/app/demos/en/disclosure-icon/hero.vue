<script setup lang="ts">
  import { Button, DisclosureIcon, DropdownMenu, DropdownMenuItem } from '@hikarinagi/ui'
</script>

<template>
  <DropdownMenu label="Sort by">
    <Button variant="outline" tone="neutral">
      <template #trailing>
        <DisclosureIcon />
      </template>
      Recently updated
    </Button>
    <template #content>
      <DropdownMenuItem>Recently updated</DropdownMenuItem>
      <DropdownMenuItem>Release date</DropdownMenuItem>
      <DropdownMenuItem>Most saved</DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
