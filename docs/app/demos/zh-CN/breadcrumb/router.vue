<script setup lang="ts">
  import { NuxtLink } from '#components'
  import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/vue'
</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem :as="NuxtLink" to="/components/button">Button</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem :as="NuxtLink" to="/components/tag">Tag</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem current>Breadcrumb</BreadcrumbItem>
  </Breadcrumb>
</template>
