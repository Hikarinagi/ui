<script setup lang="ts">
  import { VisuallyHidden as RekaVisuallyHidden } from 'reka-ui'

  defineOptions({ name: 'HnVisuallyHidden' })
</script>

<template>
  <RekaVisuallyHidden>
    <slot />
  </RekaVisuallyHidden>
</template>
