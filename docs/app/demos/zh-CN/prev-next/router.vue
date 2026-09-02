<script setup lang="ts">
  import { NuxtLink } from '#components'
  import { PrevNext, PrevNextLink } from '@hina-ui/vue'
</script>

<template>
  <PrevNext class="w-full max-w-2xl">
    <PrevNextLink direction="prev" :as="NuxtLink" to="/components/nav-link">NavLink</PrevNextLink>
    <PrevNextLink direction="next" :as="NuxtLink" to="/components/anchor">Anchor</PrevNextLink>
  </PrevNext>
</template>
