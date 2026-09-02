<script setup lang="ts">
  import { Card, SimpleGrid } from '@hikarinagi/ui'
</script>

<template>
  <SimpleGrid min="8rem" class="w-full max-w-lg">
    <Card v-for="i in 6" :key="i" class="bg-inset grid h-16 place-items-center" :padded="false">
      {{ i }}
    </Card>
  </SimpleGrid>
</template>
