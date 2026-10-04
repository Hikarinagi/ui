<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Dialog, Stack, Text } from '@hina-ui/vue'

  const modal = ref<InstanceType<typeof Dialog>>()

  function scrollTo(position: 'start' | 'end') {
    const viewport = modal.value?.viewport
    if (!viewport) return
    viewport.scrollTo({ top: position === 'start' ? 0 : viewport.scrollHeight })
  }
</script>

<template>
  <Dialog ref="modal" title="滚动容器" description="标题与页脚固定，正文独立滚动。">
    <Button variant="outline" tone="neutral">打开</Button>
    <template #content>
      <Stack gap="sm">
        <Text v-for="index in 30" :key="index">
          第 {{ index }} 行：正文在中间滚动，标题与页脚保持不动。
        </Text>
      </Stack>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" :disabled="!modal?.viewport" @click="scrollTo('start')">
        顶部
      </Button>
      <Button variant="soft" tone="neutral" :disabled="!modal?.viewport" @click="scrollTo('end')">
        底部
      </Button>
      <Button @click="close">关闭</Button>
    </template>
  </Dialog>
</template>
