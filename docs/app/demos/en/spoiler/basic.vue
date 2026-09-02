<script setup lang="ts">
  import { Spoiler, Text } from '@hina-ui/vue'
</script>

<template>
  <Text class="max-w-lg">
    Click to reveal
    <Spoiler>this hidden line</Spoiler>
    , and click again to hide it.
  </Text>
</template>
