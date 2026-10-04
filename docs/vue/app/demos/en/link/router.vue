<script setup lang="ts">
  import { Link } from '@hina-ui/vue'
  import { NuxtLink } from '#components'

  const localePath = useLocalePath()
</script>

<template>
  <Link :as="NuxtLink" :to="localePath('/components/button')" underline>Go to the Button page</Link>
</template>
