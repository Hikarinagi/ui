<script setup lang="ts">
  import { NavLink, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="none" as="nav" class="w-full max-w-56">
    <NavLink href="#" active>My shelf</NavLink>
    <NavLink href="#">Favourites</NavLink>
    <NavLink href="#" disabled>Creator centre</NavLink>
  </Stack>
</template>
