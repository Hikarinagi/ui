<script setup lang="ts">
  import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/vue'
</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem href="#">Home</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem href="#">Light novels</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem current>Spring and Asura</BreadcrumbItem>
  </Breadcrumb>
</template>
