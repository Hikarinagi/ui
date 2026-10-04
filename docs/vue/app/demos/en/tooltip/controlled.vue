<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Switch, Tooltip } from '@hina-ui/vue'

  const shown = ref(true)
</script>

<template>
  <Inline gap="lg" align="center">
    <Tooltip content="Controlled by the switch" :open="shown">
      <Button variant="outline" tone="neutral">Tooltip trigger</Button>
    </Tooltip>
    <Switch v-model="shown">Show tooltip</Switch>
  </Inline>
</template>
