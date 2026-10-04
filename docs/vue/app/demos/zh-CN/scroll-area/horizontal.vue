<script setup lang="ts">
  import { Card, Inline, ScrollArea } from '@hina-ui/vue'
</script>

<template>
  <ScrollArea direction="horizontal" class="bg-inset w-full max-w-md rounded-md">
    <Inline gap="sm" :wrap="false" class="p-4">
      <Card
        v-for="i in 12"
        :key="i"
        class="bg-surface grid size-20 shrink-0 place-items-center"
        :padded="false"
      >
        {{ i }}
      </Card>
    </Inline>
  </ScrollArea>
</template>
