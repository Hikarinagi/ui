<script setup lang="ts">
  import { Card, Stack, TreeSelect } from '@hina-ui/vue'
  import { regions } from './data'
</script>

<template>
  <Stack class="w-64">
    <TreeSelect :items="regions" placeholder="Directly on the page" aria-label="On the page" />
    <Card>
      <TreeSelect
        variant="secondary"
        :items="regions"
        placeholder="Inside a card"
        aria-label="Inside a card"
      />
    </Card>
  </Stack>
</template>
