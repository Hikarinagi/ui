<script setup lang="ts">
  import { NuxtLink } from '#components'
  import { PrevNext, PrevNextLink } from '@hina-ui/vue'

  const localePath = useLocalePath()
</script>

<template>
  <PrevNext class="w-full max-w-2xl">
    <PrevNextLink direction="prev" :as="NuxtLink" :to="localePath('/components/nav-link')">
      NavLink
    </PrevNextLink>
    <PrevNextLink direction="next" :as="NuxtLink" :to="localePath('/components/anchor')">
      Anchor
    </PrevNextLink>
  </PrevNext>
</template>
