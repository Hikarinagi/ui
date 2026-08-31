<script setup lang="ts">
  import { Prose } from '@hikarinagi/ui'
</script>

<template>
  <Prose class="max-w-lg" v-html="'<h3>A heading</h3><p>Some HTML from an API.</p>'" />
</template>
