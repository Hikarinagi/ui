<script setup lang="ts">
  import { PrevNext, PrevNextLink } from '@hina-ui/vue'
</script>

<template>
  <PrevNext label="卷内翻页" class="w-full max-w-2xl">
    <PrevNextLink direction="prev" label="上一卷" href="#">第二卷</PrevNextLink>
    <PrevNextLink direction="next" label="下一卷" href="#">第四卷</PrevNextLink>
  </PrevNext>
</template>
