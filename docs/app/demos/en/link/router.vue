<script setup lang="ts">
  import { Link } from '@hikarinagi/ui'
  import { NuxtLink } from '#components'
</script>

<template>
  <Link :as="NuxtLink" to="/components/button" underline>Go to the Button page</Link>
</template>
