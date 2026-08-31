<script setup lang="ts">
  import {
    Button,
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
  } from '@hikarinagi/ui'
</script>

<template>
  <DropdownMenu label="账户">
    <Button variant="outline" tone="neutral">星见书音</Button>
    <template #content>
      <DropdownMenuGroup>
        <DropdownMenuLabel>我的账户</DropdownMenuLabel>
        <DropdownMenuItem>个人资料</DropdownMenuItem>
        <DropdownMenuItem>偏好设置</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel>工作区</DropdownMenuLabel>
        <DropdownMenuItem>成员</DropdownMenuItem>
        <DropdownMenuItem>计费</DropdownMenuItem>
      </DropdownMenuGroup>
    </template>
  </DropdownMenu>
</template>
