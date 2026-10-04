<script setup lang="ts">
  import { NavLink, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="none" as="nav" class="w-full max-w-56">
    <NavLink href="#">Overview</NavLink>
    <NavLink href="#">My shelf</NavLink>
    <NavLink href="#">Favourites</NavLink>
  </Stack>
</template>
