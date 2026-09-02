<script setup lang="ts">
  import { House } from '@lucide/vue'
  import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator, VisuallyHidden } from '@hina-ui/vue'
</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem href="#" class="inline-flex items-center">
      <House class="size-4" aria-hidden="true" />
      <VisuallyHidden>Home</VisuallyHidden>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem href="#">Galgame</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem current>ATRI -My Dear Moments-</BreadcrumbItem>
  </Breadcrumb>
</template>
