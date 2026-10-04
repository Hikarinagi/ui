<script setup lang="ts">
  import { Button, Dialog, Inline, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Dialog title="居中" placement="center">
      <Button variant="outline" tone="neutral">center</Button>
      <template #content>
        <Text>任何屏幕宽度下都居中显示。</Text>
      </template>
    </Dialog>
    <Dialog title="贴顶" placement="top">
      <Button variant="outline" tone="neutral">top</Button>
      <template #content>
        <Text>从顶部滑入，保留顶部留白，窄屏上也保持贴顶。</Text>
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
        <Text>宽屏居中，窄屏贴底并占满宽度。缩窄窗口后重新打开即可看到。</Text>
      </template>
    </Dialog>
  </Inline>
</template>
