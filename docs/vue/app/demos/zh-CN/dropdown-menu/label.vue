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
  <DropdownMenu label="账户">
    <Button variant="outline" tone="neutral">
      <template #icon>
        <Avatar size="sm" src="/avatars/huh.webp" alt="星见书音" />
      </template>
      星见书音
    </Button>
    <template #content>
      <DropdownMenuLabel>我的账户</DropdownMenuLabel>
      <DropdownMenuItem>个人资料</DropdownMenuItem>
      <DropdownMenuItem>偏好设置</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>工作区</DropdownMenuLabel>
      <DropdownMenuItem>成员</DropdownMenuItem>
      <DropdownMenuItem>计费</DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
