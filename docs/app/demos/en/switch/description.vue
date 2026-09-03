<script setup lang="ts">
  import { ref } from 'vue'
  import { Switch } from '@hina-ui/vue'

  const sync = ref(true)
</script>

<template>
  <Switch
    v-model="sync"
    description="Pick up where you left off when you open the same work on another device."
  >
    Sync reading progress
  </Switch>
</template>
