<script setup lang="ts">
  import { AlertDialog, Button } from '@hina-ui/vue'
</script>

<template>
  <AlertDialog
    title="注销账号？"
    description="账号与所有数据会在 30 天后永久删除，期间登录即可撤销。"
    tone="danger"
    confirm-text="注销"
  >
    <Button variant="outline" tone="danger">注销账号</Button>
  </AlertDialog>
</template>
