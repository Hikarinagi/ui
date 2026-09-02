<script setup lang="ts">
  import { Prose } from '@hina-ui/vue'
</script>

<template>
  <Prose class="max-w-lg">
    <p>Quotations in body content need no separate component.</p>
    <blockquote>A blockquote written in an article picks up the same styling.</blockquote>
    <p>It matches the component exactly.</p>
  </Prose>
</template>
