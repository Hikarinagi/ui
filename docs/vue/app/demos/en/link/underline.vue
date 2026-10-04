<script setup lang="ts">
  import { Inline, Link } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Link href="#underline">Without underline</Link>
    <Link href="#underline" underline>With underline</Link>
  </Inline>
</template>
