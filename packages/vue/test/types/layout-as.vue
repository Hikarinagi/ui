<script setup lang="ts">
  import { defineAsyncComponent, h, type FunctionalComponent } from 'vue'
  import { Flex, Inline, Link, Stack } from '../../src'

  const FunctionalRoot: FunctionalComponent = (_, { attrs, slots }) =>
    h('section', attrs, slots.default?.())
  const AsyncRoot = defineAsyncComponent(() => import('../../src/components/link/Link.vue'))
</script>

<template>
  <Inline as="nav">Navigation</Inline>
  <Flex as="main">Main content</Flex>
  <Stack as="section">Section</Stack>

  <Inline :as="Link" href="/destination">Destination</Inline>
  <Flex :as="Link" href="/destination">Destination</Flex>
  <Stack :as="Link" href="/destination">Destination</Stack>

  <Inline :as="FunctionalRoot">Content</Inline>
  <Flex :as="FunctionalRoot">Content</Flex>
  <Stack :as="FunctionalRoot">Content</Stack>

  <Inline :as="AsyncRoot" href="/destination">Destination</Inline>
  <Flex :as="AsyncRoot" href="/destination">Destination</Flex>
  <Stack :as="AsyncRoot" href="/destination">Destination</Stack>

  <!-- @vue-expect-error as must remain a string or Vue component -->
  <Inline :as="42" />
  <!-- @vue-expect-error as must remain a string or Vue component -->
  <Flex :as="42" />
  <!-- @vue-expect-error as must remain a string or Vue component -->
  <Stack :as="42" />
</template>
