<script setup lang="ts">
  import { Inline, Link } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Link href="#underline">不带下划线</Link>
    <Link href="#underline" underline>带下划线</Link>
  </Inline>
</template>
