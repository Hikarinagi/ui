<script setup lang="ts">
  import { Button, Inline, toast } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-3">
    <Button
      variant="outline"
      tone="neutral"
      @click="
        toast('已移入回收站', {
          action: { label: '撤销', onClick: () => toast.success('已还原') },
        })
      "
    >
      带操作
    </Button>
    <Button
      variant="outline"
      tone="neutral"
      @click="
        toast.warning('确定要清空吗', {
          duration: 0,
          action: { label: '清空', onClick: () => toast.success('已清空') },
          cancel: { label: '取消' },
        })
      "
    >
      两个按钮
    </Button>
  </Inline>
</template>
