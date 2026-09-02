<script setup lang="ts">
  import { Plus } from '@lucide/vue'
  import { Button, DisclosureIcon, DropdownMenu, DropdownMenuItem } from '@hikarinagi/ui'
</script>

<template>
  <DropdownMenu label="Add to">
    <Button variant="outline" tone="neutral">
      <template #trailing>
        <DisclosureIcon direction="end">
          <Plus />
        </DisclosureIcon>
      </template>
      Add to
    </Button>
    <template #content>
      <DropdownMenuItem>Want to read</DropdownMenuItem>
      <DropdownMenuItem>Reading</DropdownMenuItem>
      <DropdownMenuItem>Read</DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
