<script setup lang="ts">
  import { Button, DisclosureIcon, DropdownMenu, DropdownMenuItem, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <DropdownMenu label="Opens downwards">
      <Button variant="outline" tone="neutral">
        <template #trailing>
          <DisclosureIcon />
        </template>
        down
      </Button>
      <template #content>
        <DropdownMenuItem>Rests pointing down</DropdownMenuItem>
        <DropdownMenuItem>Turns a half circle</DropdownMenuItem>
      </template>
    </DropdownMenu>
    <DropdownMenu label="Opens a level">
      <Button variant="outline" tone="neutral">
        <template #trailing>
          <DisclosureIcon direction="end" />
        </template>
        end
      </Button>
      <template #content>
        <DropdownMenuItem>Rests pointing to the line end</DropdownMenuItem>
        <DropdownMenuItem>Turns a quarter</DropdownMenuItem>
      </template>
    </DropdownMenu>
  </Inline>
</template>
