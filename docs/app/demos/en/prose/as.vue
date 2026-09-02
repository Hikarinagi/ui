<script setup lang="ts">
  import { Prose } from '@hina-ui/vue'
</script>

<template>
  <Prose as="article" class="max-w-lg">
    <h3>Rendered as an article</h3>
    <p>The container tag comes from as; the body styling is unchanged.</p>
  </Prose>
</template>
