<script setup lang="ts">
  import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/vue'
</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem href="#">Home</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem href="#">Galgame</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem href="#">枕</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem current>サクラノ詩</BreadcrumbItem>
  </Breadcrumb>
</template>
