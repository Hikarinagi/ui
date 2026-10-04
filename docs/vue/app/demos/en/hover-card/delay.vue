<script setup lang="ts">
  import { HoverCard, Inline, Link, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg">
    <HoverCard :open-delay="0" :close-delay="0">
      <Link href="#">At once</Link>
      <template #content>
        <Text size="sm">No delay; it appears as soon as the pointer arrives.</Text>
      </template>
    </HoverCard>
    <HoverCard :open-delay="800" :close-delay="400">
      <Link href="#">Rest a little longer</Link>
      <template #content>
        <Text size="sm">
          Appears after 800 milliseconds and closes 400 milliseconds after leaving.
        </Text>
      </template>
    </HoverCard>
  </Inline>
</template>
