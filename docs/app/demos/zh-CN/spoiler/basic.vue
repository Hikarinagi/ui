<script setup lang="ts">
  import { Spoiler, Text } from '@hikarinagi/ui'
</script>

<template>
  <Text class="max-w-lg">
    点击揭示
    <Spoiler>这段被遮住的文字</Spoiler>
    ，再点一次重新遮住。
  </Text>
</template>
