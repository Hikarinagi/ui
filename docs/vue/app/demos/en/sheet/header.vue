<script setup lang="ts">
  import { Button, Inline, Sheet, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline>
    <Sheet
      v-for="handle in [true, false]"
      :key="String(handle)"
      title="Hidden header"
      description="The title and description remain available to assistive technology."
      :header="false"
      :handle="handle"
    >
      <Button variant="outline" tone="neutral">
        {{ handle ? 'Keep handle' : 'Hide entire top' }}
      </Button>
      <template #content>
        <Text>Content starts below the handle or at the regular panel padding.</Text>
      </template>
      <template #footer="{ close }">
        <Button variant="soft" tone="neutral" @click="close">Close</Button>
      </template>
    </Sheet>
  </Inline>
</template>
