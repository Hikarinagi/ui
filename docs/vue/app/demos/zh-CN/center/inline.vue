<script setup lang="ts">
  import { ExternalLink } from '@lucide/vue'
  import { Center, Link, Text } from '@hina-ui/vue'
</script>

<template>
  <Text class="max-w-md">
    这段话中间嵌着一个
    <Center inline class="gap-1">
      <Link href="#">外部链接</Link>
      <ExternalLink class="size-3.5" />
    </Center>
    ，图标与文字在同一行里对齐。
  </Text>
</template>
