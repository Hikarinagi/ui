<script setup lang="ts">
  import { CircleUser, House, Settings } from '@lucide/vue'
  import { NavLink, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="none" as="nav" class="w-full max-w-56">
    <NavLink href="#" active>
      <template #icon><House /></template>
      Overview
    </NavLink>
    <NavLink href="#">
      <template #icon><CircleUser /></template>
      Account
    </NavLink>
    <NavLink href="#">
      <template #icon><Settings /></template>
      Settings
    </NavLink>
  </Stack>
</template>
