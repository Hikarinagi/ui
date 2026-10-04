<script setup lang="ts">
  import { Panel, Switch } from '@hina-ui/vue'
</script>

<template>
  <Panel title="公开资料" description="这些信息会显示在你的个人页上，所有人可见。" class="w-96">
    <Switch>显示收藏列表</Switch>
  </Panel>
</template>
