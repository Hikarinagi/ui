<script setup lang="ts">
  import { Spoiler, Text } from '@hina-ui/vue'
</script>

<template>
  <Text class="max-w-lg">
    指针移入即可看到
    <Spoiler reveal-on="hover">悬停揭示的内容</Spoiler>
    ，移出后重新遮住。
  </Text>
</template>
