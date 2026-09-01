<script setup lang="ts">
  import { Button, toast } from '@hikarinagi/ui'
</script>

<template>
  <Button variant="outline" tone="neutral" @click="toast('草稿已保存')">保存草稿</Button>
</template>
