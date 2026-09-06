<script setup lang="ts">
  import { Panel, Switch } from '@hina-ui/vue'
</script>

<template>
  <Panel
    title="Public profile"
    description="This information shows on your profile page and is visible to everyone."
    class="w-96"
  >
    <Switch>Show my bookmarks</Switch>
  </Panel>
</template>
