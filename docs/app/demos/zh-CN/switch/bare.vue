<script setup lang="ts">
  import { ref } from 'vue'
  import { Switch, Inline } from '@hina-ui/vue'

  const dark = ref(false)
</script>

<template>
  <Inline gap="sm">
    <Switch v-model="dark" aria-label="深色模式" />
  </Inline>
</template>
