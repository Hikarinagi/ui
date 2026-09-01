<script setup lang="ts">
  import { Button, Dialog, Inline, Text } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Dialog title="居中" placement="center">
      <Button variant="outline" tone="neutral">center</Button>
      <template #content>
        <Text>任何屏幕宽度下都居中显示。</Text>
      </template>
    </Dialog>
    <Dialog title="贴底" placement="bottom">
      <Button variant="outline" tone="neutral">bottom</Button>
      <template #content>
        <Text>从底部滑入，四角保留圆角。</Text>
      </template>
    </Dialog>
    <Dialog title="随屏幕变化">
      <Button variant="outline" tone="neutral">默认</Button>
      <template #content>
        <Text>宽屏居中，窄屏贴底并撑满宽度。把窗口缩窄再打开一次就能看到。</Text>
      </template>
    </Dialog>
  </Inline>
</template>
