<script setup lang="ts">
  import { ref } from 'vue'
  import { Switch, Inline } from '@hina-ui/vue'

  const dark = ref(false)
</script>

<template>
  <Inline gap="sm">
    <Switch v-model="dark" aria-label="Dark mode" />
  </Inline>
</template>
