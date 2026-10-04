<script setup lang="ts">
  import { Plus } from '@lucide/vue'
  import { Button, DisclosureIcon, DropdownMenu, DropdownMenuItem } from '@hina-ui/vue'
</script>

<template>
  <DropdownMenu label="添加">
    <Button variant="outline" tone="neutral">
      <template #trailing>
        <DisclosureIcon direction="end">
          <Plus />
        </DisclosureIcon>
      </template>
      添加到
    </Button>
    <template #content>
      <DropdownMenuItem>想读</DropdownMenuItem>
      <DropdownMenuItem>在读</DropdownMenuItem>
      <DropdownMenuItem>读过</DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
