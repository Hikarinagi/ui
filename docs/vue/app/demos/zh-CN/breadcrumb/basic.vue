<script setup lang="ts">
  import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/vue'
</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem href="#">首页</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem href="#">轻小说</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem current>春与修罗</BreadcrumbItem>
  </Breadcrumb>
</template>
