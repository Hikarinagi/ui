<script setup lang="ts">
  import { Chip, Inline } from '@hina-ui/vue'

  const localePath = useLocalePath()
</script>

<template>
  <NuxtLink v-slot="{ href, navigate }" :to="localePath('/components/tag')" custom>
    <Inline>
      <Chip as="a" :href="href" @click="navigate">科幻</Chip>
      <Chip as="a" :href="href" @click="navigate">校园</Chip>
      <Chip as="a" :href="href" variant="outline" @click="navigate">恋爱</Chip>
    </Inline>
  </NuxtLink>
</template>
