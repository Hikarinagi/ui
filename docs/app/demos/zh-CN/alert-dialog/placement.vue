<script setup lang="ts">
  import { AlertDialog, Button, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="sm">
    <AlertDialog title="清空回收站？" description="回收站里的 12 个文件会被永久删除。" size="md">
      <Button variant="outline" tone="neutral">md 尺寸</Button>
    </AlertDialog>
    <AlertDialog
      title="清空回收站？"
      description="回收站里的 12 个文件会被永久删除。"
      placement="center"
    >
      <Button variant="outline" tone="neutral">始终居中</Button>
    </AlertDialog>
    <AlertDialog
      title="清空回收站？"
      description="回收站里的 12 个文件会被永久删除。"
      placement="bottom"
    >
      <Button variant="outline" tone="neutral">始终贴底</Button>
    </AlertDialog>
  </Inline>
</template>
