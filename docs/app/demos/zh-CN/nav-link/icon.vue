<script setup lang="ts">
  import { CircleUser, House, Settings } from '@lucide/vue'
  import { NavLink, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="none" as="nav" class="w-full max-w-56">
    <NavLink href="#" active>
      <template #icon><House /></template>
      概览
    </NavLink>
    <NavLink href="#">
      <template #icon><CircleUser /></template>
      账号
    </NavLink>
    <NavLink href="#">
      <template #icon><Settings /></template>
      设置
    </NavLink>
  </Stack>
</template>
