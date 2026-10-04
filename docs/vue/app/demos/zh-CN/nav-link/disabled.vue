<script setup lang="ts">
  import { NavLink, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="none" as="nav" class="w-full max-w-56">
    <NavLink href="#" active>我的书架</NavLink>
    <NavLink href="#">收藏</NavLink>
    <NavLink href="#" disabled>创作中心</NavLink>
  </Stack>
</template>
