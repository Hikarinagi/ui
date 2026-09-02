<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Drawer, Text } from '@hina-ui/vue'

  const open = ref(false)
  const saving = ref(false)

  function save() {
    saving.value = true
    setTimeout(() => {
      saving.value = false
      open.value = false
    }, 2000)
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    title="编辑标签"
    description="保存过程中请不要关闭这个抽屉。"
    :locked="saving"
  >
    <Button variant="outline" tone="neutral">编辑标签</Button>
    <template #content>
      <Text>{{ saving ? '正在保存，两秒后自动关闭。' : '点击保存之后抽屉会锁定两秒。' }}</Text>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" :disabled="saving" @click="close">取消</Button>
      <Button :loading="saving" @click="save">保存</Button>
    </template>
  </Drawer>
</template>
