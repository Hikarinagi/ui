<script setup lang="ts">
  import { Button, DisclosureIcon, DropdownMenu, DropdownMenuItem, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline>
    <DropdownMenu label="向下展开">
      <Button variant="outline" tone="neutral">
        <template #trailing>
          <DisclosureIcon />
        </template>
        down
      </Button>
      <template #content>
        <DropdownMenuItem>静止时朝下</DropdownMenuItem>
        <DropdownMenuItem>展开时旋转半圈</DropdownMenuItem>
      </template>
    </DropdownMenu>
    <DropdownMenu label="向层级展开">
      <Button variant="outline" tone="neutral">
        <template #trailing>
          <DisclosureIcon direction="end" />
        </template>
        end
      </Button>
      <template #content>
        <DropdownMenuItem>静止时朝向行末</DropdownMenuItem>
        <DropdownMenuItem>展开时旋转四分之一圈</DropdownMenuItem>
      </template>
    </DropdownMenu>
  </Inline>
</template>
