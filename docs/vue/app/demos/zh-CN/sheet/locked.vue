<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Sheet, Text } from '@hina-ui/vue'

  const open = ref(false)
  const saving = ref(false)

  async function save() {
    saving.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))
    saving.value = false
    open.value = false
  }
</script>

<template>
  <Sheet v-model:open="open" title="保存修改" description="保存期间面板不能关闭。" :locked="saving">
    <Button variant="outline" tone="neutral">打开</Button>
    <template #content>
      <Text>点「保存」后一秒半内，拖动、Esc 与遮罩都不会关闭它。</Text>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" :disabled="saving" @click="close">取消</Button>
      <Button :loading="saving" @click="save">保存</Button>
    </template>
  </Sheet>
</template>
