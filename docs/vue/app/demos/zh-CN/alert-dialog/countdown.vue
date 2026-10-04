<script setup lang="ts">
  import { AlertDialog, Button } from '@hina-ui/vue'
</script>

<template>
  <AlertDialog
    title="确认操作？"
    description="倒计时结束后，确认按钮可以点击。"
    tone="danger"
    confirm-text="确认"
    :confirm-delay="3"
  >
    <Button variant="outline" tone="neutral">确认倒计时</Button>
  </AlertDialog>
</template>
