<script setup lang="ts">
  import { ref } from 'vue'
  import { Chip, Inline } from '@hikarinagi/ui'

  const finished = ref(true)
  const translated = ref(false)
</script>

<template>
  <Inline>
    <Chip v-model:selected="finished" selectable>已完结</Chip>
    <Chip v-model:selected="translated" selectable>有汉化</Chip>
  </Inline>
</template>
