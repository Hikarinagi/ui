<script setup lang="ts">
  import { Spoiler, Text } from '@hikarinagi/ui'
</script>

<template>
  <Text class="max-w-lg">
    Move the pointer in to see
    <Spoiler reveal-on="hover">the hidden content</Spoiler>
    , and it hides again as the pointer leaves.
  </Text>
</template>
