<script setup lang="ts">
  import { Link } from '@hina-ui/vue'
  import { NuxtLink } from '#components'
</script>

<template>
  <Link :as="NuxtLink" to="/components/button" underline>跳转到 Button 页</Link>
</template>
