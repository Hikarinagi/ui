<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Dialog, Text } from '@hikarinagi/ui'

  const open = ref(false)
  const submitting = ref(false)

  function submit() {
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      open.value = false
    }, 2000)
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    title="导入书库"
    description="导入过程中请不要关闭这个对话框。"
    :locked="submitting"
  >
    <Button variant="outline" tone="neutral">导入</Button>
    <template #content>
      <Text>
        {{ submitting ? '正在导入，两秒后自动关闭。' : '点击开始导入之后对话框会锁定两秒。' }}
      </Text>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" :disabled="submitting" @click="close">取消</Button>
      <Button :loading="submitting" @click="submit">开始导入</Button>
    </template>
  </Dialog>
</template>
