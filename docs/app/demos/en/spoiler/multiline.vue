<script setup lang="ts">
  import { Spoiler, Text } from '@hikarinagi/ui'
</script>

<template>
  <Text class="max-w-sm">
    <Spoiler>
      A spoiler spanning several lines can be hidden as a whole; revealing it starts where the
      pointer lands and fills the passage line by line.
    </Spoiler>
  </Text>
</template>
