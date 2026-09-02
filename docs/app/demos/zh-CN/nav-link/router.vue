<script setup lang="ts">
  import { NuxtLink } from '#components'
  import { NavLink, Stack } from '@hina-ui/vue'

  const route = useRoute()
  const links = [
    { to: '/components/breadcrumb', label: 'Breadcrumb' },
    { to: '/components/nav-link', label: 'NavLink' },
    { to: '/components/splitter', label: 'Splitter' },
  ]
</script>

<template>
  <Stack gap="none" as="nav" class="w-full max-w-56">
    <NavLink
      v-for="link in links"
      :key="link.to"
      :as="NuxtLink"
      :to="link.to"
      :active="route.path.endsWith(link.to)"
    >
      {{ link.label }}
    </NavLink>
  </Stack>
</template>
