<script setup lang="ts">
  import { Stack, TreeSelect } from '@hina-ui/vue'
  import { regions } from './data'
</script>

<template>
  <Stack class="w-64">
    <TreeSelect size="sm" :items="regions" model-value="tokyo" aria-label="小号" />
    <TreeSelect size="md" :items="regions" model-value="tokyo" aria-label="中号" />
    <TreeSelect size="lg" :items="regions" model-value="tokyo" aria-label="大号" />
  </Stack>
</template>
