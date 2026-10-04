<script setup lang="ts">
  import { PrevNext, PrevNextLink } from '@hina-ui/vue'
</script>

<template>
  <PrevNext label="Volume pagination" class="w-full max-w-2xl">
    <PrevNextLink direction="prev" label="Previous volume" href="#">Volume 2</PrevNextLink>
    <PrevNextLink direction="next" label="Next volume" href="#">Volume 4</PrevNextLink>
  </PrevNext>
</template>
