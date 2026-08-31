<script setup lang="ts">
  import { CopyButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center">
    <CopyButton text="默认两秒" />
    <CopyButton text="五秒后复位" :timeout="5000" />
  </Inline>
</template>
