<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Switch, Tooltip } from '@hina-ui/vue'

  const shown = ref(true)
</script>

<template>
  <Inline gap="lg" align="center">
    <Tooltip content="由右边的开关控制" :open="shown">
      <Button variant="outline" tone="neutral">提示的触发器</Button>
    </Tooltip>
    <Switch v-model="shown">显示提示</Switch>
  </Inline>
</template>
