<script setup lang="ts">
  import { NuxtLink } from '#components'
  import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/vue'

  const localePath = useLocalePath()
</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem :as="NuxtLink" :to="localePath('/components/button')">Button</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem :as="NuxtLink" :to="localePath('/components/tag')">Tag</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem current>Breadcrumb</BreadcrumbItem>
  </Breadcrumb>
</template>
