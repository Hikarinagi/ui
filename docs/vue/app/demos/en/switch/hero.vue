<script setup lang="ts">
  import { ref } from 'vue'
  import { Switch } from '@hina-ui/vue'

  const autoplay = ref(true)
</script>

<template>
  <Switch v-model="autoplay">Autoplay the next episode</Switch>
</template>
