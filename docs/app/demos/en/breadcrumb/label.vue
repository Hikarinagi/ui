<script setup lang="ts">
  import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/vue'
</script>

<template>
  <Breadcrumb label="Title location">
    <BreadcrumbItem href="#">Home</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem href="#">Light novels</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem current>Volume 3</BreadcrumbItem>
  </Breadcrumb>
</template>
