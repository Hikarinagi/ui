<script setup lang="ts">
  import { Download, Share2 } from '@lucide/vue'
  import {
    Button,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
  } from '@hina-ui/vue'
</script>

<template>
  <DropdownMenu label="文件操作" align="start">
    <Button variant="outline" tone="neutral">文件</Button>
    <template #content>
      <DropdownMenuItem>重命名</DropdownMenuItem>
      <DropdownMenuSub label="分享给">
        <template #icon>
          <Share2 />
        </template>
        <DropdownMenuItem>复制链接</DropdownMenuItem>
        <DropdownMenuItem>发送到邮箱</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>邀请协作者</DropdownMenuItem>
      </DropdownMenuSub>
      <DropdownMenuSub label="导出为">
        <template #icon>
          <Download />
        </template>
        <DropdownMenuItem>PDF</DropdownMenuItem>
        <DropdownMenuItem>EPUB</DropdownMenuItem>
        <DropdownMenuItem>纯文本</DropdownMenuItem>
      </DropdownMenuSub>
    </template>
  </DropdownMenu>
</template>
